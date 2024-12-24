"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { loadMixamoAnimation } from "../helpers/loadMixamoAnimation";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { azureToVrmBlendShapes } from "../helpers/azureToVrmBlendShapes";
import { fetchWithProgress } from "../helpers/fetchWithProgress";
import { throttle } from "../helpers/throttle";
import { cacheVRM, getCachedVRM } from "../helpers/indexedDb";
import { hexStringToArrayBuffer } from "../helpers/crypto";

// Constants
const VRM_KEY_HEX = process.env.NEXT_PUBLIC_VRM_KEY as string;
const VRM_IV_HEX = process.env.NEXT_PUBLIC_VRM_IV as string;

const idleAnimations = [
  "/animations/idle-1.fbx",
  "/animations/idle-2.fbx",
  // "/animations/fan-face.fbx",
  // "/animations/happy-idle.fbx",
  // "/animations/look-hand.fbx",
];

const talkAnimations = [
  "/animations/talk-1.fbx",
  "/animations/talk-2.fbx",
  "/animations/talk-3.fbx",
];

interface DecryptedVRM {
  url: string;
  blob: Blob;
}

// Utility function to process blend shapes data
const processBlendShapesData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blendShapesData: any[],
): { frameIndex: number; blendShapeValues: number[] }[] => {
  const frames: { frameIndex: number; blendShapeValues: number[] }[] = [];
  let cumulativeFrameIndex = 0;

  for (const keyframe of blendShapesData) {
    const frameIndex = keyframe.FrameIndex; // Number of frames before this keyframe
    const blendShapesArray = keyframe.BlendShapes; // Array of arrays

    // Handle any gaps between cumulativeFrameIndex and keyframe's FrameIndex
    while (cumulativeFrameIndex < frameIndex) {
      // Fill gaps with neutral frames (all zeros)
      frames.push({
        frameIndex: cumulativeFrameIndex,
        blendShapeValues: new Array(55).fill(0),
      });
      cumulativeFrameIndex++;
    }

    // Process the blendShape frames in the keyframe
    for (const blendShapeValues of blendShapesArray) {
      frames.push({
        frameIndex: cumulativeFrameIndex,
        blendShapeValues: blendShapeValues,
      });
      cumulativeFrameIndex++;
    }
  }

  return frames;
};

const getBlendShapeKey = (index: number): string => {
  return azureToVrmBlendShapes[index];
};

interface VrmAvatarProps {
  avatarKey: string;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  onLoadingProgress: (progress: number) => void;
  audioBlob: Blob | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blendShapes: any[];
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface ProcessedFrame {
  frameIndex: number;
  blendShapeValues: number[];
}

const VrmAvatar: React.FC<VrmAvatarProps> = ({
  avatarKey,
  audioRef,
  onLoadingProgress,
  audioBlob,
  blendShapes,
  position,
  rotation,
  scale,
}) => {
  const [gltf, setGltf] = useState<GLTF | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [idleClips, setIdleClips] = useState<THREE.AnimationClip[]>([]);
  const [talkClips, setTalkClips] = useState<THREE.AnimationClip[]>([]);
  const [audioReady, setAudioReady] = useState(false);
  const [processedFrames, setProcessedFrames] = useState<ProcessedFrame[]>([]);
  const [decryptedVrm, setDecryptedVrm] = useState<DecryptedVRM | null>(null);
  const audioBlobCounterRef = useRef<number>(0);

  // Decrypt VRM Function
  const decryptVRM = useCallback(
    async (
      encryptedData: ArrayBuffer,
      key: ArrayBuffer,
      iv: ArrayBuffer,
    ): Promise<Uint8Array> => {
      try {
        const algorithm = { name: "AES-CBC", iv };
        const cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          key,
          algorithm,
          false,
          ["decrypt"],
        );
        const decrypted = await window.crypto.subtle.decrypt(
          algorithm,
          cryptoKey,
          encryptedData,
        );
        return new Uint8Array(decrypted);
      } catch (error) {
        console.error("Error during decryption:", error);
        throw error;
      }
    },
    [],
  );

  // Fetch and Decrypt VRM
  const fetchAndDecryptVRM = useCallback(
    async (avatarKey: string) => {
      try {
        onLoadingProgress(0);

        // Retrieve encrypted VRM from cache or fetch it
        let encryptedData = await getCachedVRM(avatarKey);
        if (!encryptedData) {
          encryptedData = await fetchWithProgress(
            `/api/vrm/decrypt?file=${avatarKey}`,
            throttle((prog: number) => onLoadingProgress(prog), 250),
          );
          await cacheVRM(avatarKey, encryptedData);
        } else {
          console.log("Loaded VRM from cache");
        }

        // Convert hex to ArrayBuffer
        const key = hexStringToArrayBuffer(VRM_KEY_HEX);
        const iv = hexStringToArrayBuffer(VRM_IV_HEX);

        // Decrypt VRM
        const decryptedData = await decryptVRM(encryptedData, key, iv);
        const blob = new Blob([decryptedData.buffer as BlobPart], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);

        setDecryptedVrm({ url, blob });
        onLoadingProgress(100);
      } catch (error) {
        console.error("Error decrypting VRM:", error);
        onLoadingProgress(0);
      }
    },
    [decryptVRM, onLoadingProgress],
  );

  useEffect(() => {
    if (avatarKey) {
      fetchAndDecryptVRM(avatarKey);
    }
  }, [avatarKey, fetchAndDecryptVRM]);

  // Effect to process blend shapes data
  useEffect(() => {
    if (blendShapes && blendShapes.length > 0) {
      const frames = processBlendShapesData(blendShapes);
      setProcessedFrames(frames);
    }
  }, [blendShapes]);

  // Function to load VRM model
  const loadModel = useCallback(
    async (vrmUrl: string) => {
      if (typeof window === "undefined") return;

      try {
        // Initialize GLTFLoader with VRM plugins
        const loader = new GLTFLoader().register(
          (parser) =>
            new VRMLoaderPlugin(parser, {
              autoUpdateHumanBones: true,
            }),
        );

        // Load VRM model
        loader.load(
          vrmUrl,
          async (loadedGltf) => {
            const vrm: VRM = loadedGltf.userData.vrm;

            if (!vrm || !vrm?.expressionManager) {
              console.error("Error loading VRM model:", loadedGltf);
              return;
            }

            // Optimize VRM scene
            VRMUtils.removeUnnecessaryVertices(loadedGltf.scene);
            VRMUtils.removeUnnecessaryJoints(loadedGltf.scene, {
              experimentalSameBoneCounts: true,
            });

            // Disable frustum culling for all objects in the scene
            loadedGltf.scene.traverse((obj: THREE.Object3D) => {
              obj.frustumCulled = false;
            });

            // Rotate VRM to face the correct direction
            VRMUtils.rotateVRM0(vrm);

            setGltf(loadedGltf);

            // Initialize AnimationMixer
            const newMixer = new THREE.AnimationMixer(loadedGltf.scene);
            setMixer(newMixer);

            // Load idle animations
            const loadedIdleClips = await Promise.all(
              idleAnimations.map(async (url) => {
                const clip = await loadMixamoAnimation(url, vrm);
                return clip;
              }),
            );
            setIdleClips(loadedIdleClips);

            // Load talk animations
            const loadedTalkClips = await Promise.all(
              talkAnimations.map(async (url) => {
                const clip = await loadMixamoAnimation(url, vrm);
                return clip;
              }),
            );
            setTalkClips(loadedTalkClips);

            // Play the first idle animation by default
            if (loadedIdleClips.length > 0) {
              const idleClip = loadedIdleClips[0];
              newMixer.clipAction(idleClip).play();
            }

            // blink loop
            const blinkTrack =
              vrm?.expressionManager.getExpressionTrackName("Blink");

            const blinkKeys = new THREE.NumberKeyframeTrack(
              blinkTrack as string,
              [0.0, 0.2, 0.4, 6.0], // times
              [0.0, 1.0, 0.0, 0.0], // values
            );
            const blinkClip = new THREE.AnimationClip(
              blinkTrack as string,
              6.8, // duration
              [blinkKeys],
            );
            const action = newMixer.clipAction(blinkClip);
            action.play();

            //emotions

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const expressions: any = [];

            const angryTrack =
              vrm?.expressionManager.getExpressionTrackName("Angry");
            const angryKeys = new THREE.NumberKeyframeTrack(
              angryTrack as string,
              [0.0, 2.0, 4.0, 6.0], // times
              [0.0, 1.0, 0.0, 0.0], // values
            );
            const angryClip = new THREE.AnimationClip(
              angryTrack as string,
              6.0, // duration
              [angryKeys],
            );
            const angryAction = newMixer.clipAction(angryClip);
            expressions.push(angryAction);

            const joyTrack =
              vrm?.expressionManager.getExpressionTrackName("Joy");
            const joyKeys = new THREE.NumberKeyframeTrack(
              joyTrack as string,
              [0.0, 2.5, 5.0, 6.0], // times
              [0.0, 1.0, 0.0, 0.0], // values
            );
            const joyClip = new THREE.AnimationClip(
              joyTrack as string,
              6.0, // duration
              [joyKeys],
            );
            const joyAction = newMixer.clipAction(joyClip);
            expressions.push(joyAction);

            const sorrowTrack =
              vrm?.expressionManager.getExpressionTrackName("Sorrow");
            const sorrowKeys = new THREE.NumberKeyframeTrack(
              sorrowTrack as string,
              [0.0, 3.0, 6.0], // times
              [0.0, 1.0, 0.0], // values
            );
            const sorrowClip = new THREE.AnimationClip(
              sorrowTrack as string,
              6.0, // duration
              [sorrowKeys],
            );
            const sorrowAction = newMixer.clipAction(sorrowClip);
            expressions.push(sorrowAction);

            const funTrack =
              vrm?.expressionManager.getExpressionTrackName("Fun");
            const funKeys = new THREE.NumberKeyframeTrack(
              funTrack as string,
              [0.0, 1.5, 3.0, 4.5, 6.0], // times
              [0.0, 1.0, 0.0, 1.0, 0.0], // values
            );
            const funClip = new THREE.AnimationClip(
              funTrack as string,
              6.0, // duration
              [funKeys],
            );
            const funAction = newMixer.clipAction(funClip);
            expressions.push(funAction);

            // Function to play a random expression
            let currentAction: THREE.AnimationAction | null = null;

            const playRandomExpression = () => {
              if (currentAction) {
                currentAction.stop();
              }
              const randomIndex = Math.floor(
                Math.random() * expressions.length,
              );
              const nextAction = expressions[randomIndex];
              nextAction.reset();
              nextAction.play();
              currentAction = nextAction;
            };

            // Initial play
            playRandomExpression();

            // Switch expression every 6 seconds
            setInterval(playRandomExpression, 6000);
          },
          (event) => {
            // Update loading progress
            const progress = (event.loaded / event.total) * 100;
            onLoadingProgress(progress);
          },
          (error) => {
            console.error("Error loading VRM model:", error);
          },
        );
      } catch (error) {
        console.error("Error in loadModel:", error);
      }
    },
    [onLoadingProgress],
  );

  // Effect to load VRM model on component mount
  useEffect(() => {
    if (decryptedVrm?.url) {
      loadModel(decryptedVrm?.url);
    }
  }, [decryptedVrm?.url, loadModel]);

  // Effect to handle audio loading and synchronization
  useEffect(() => {
    if (
      audioBlob &&
      blendShapes.length > 0 &&
      gltf &&
      (idleClips.length > 0 || talkClips.length > 0) &&
      mixer
    ) {
      // Increment the audioBlob counter
      audioBlobCounterRef.current += 1;

      // Determine whether to play talk animation or not
      const shouldPlayTalkAnimation = audioBlobCounterRef.current % 2 === 1;

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      const audioURL = URL.createObjectURL(audioBlob);
      console.log("Audio URL:", audioURL);
      audio.src = audioURL;

      const handleCanPlayThrough = () => {
        console.log("Audio duration:", audio.duration);
        if (isNaN(audio.duration) || audio.duration === 0) {
          console.error(
            "Audio duration is not available after canplaythrough event.",
          );
          return;
        }
        setAudioReady(true);
        audio.play();

        if (shouldPlayTalkAnimation && talkClips.length > 0) {
          // Play a random talkAnimation
          const randomTalkClip =
            talkClips[Math.floor(Math.random() * talkClips.length)];

          // fadeOut idle transition when talk is finished, idle back again
          for (const idleClip of idleClips) {
            mixer.existingAction(idleClip)?.fadeOut(0.5);
          }

          const talkAction = mixer
            .clipAction(randomTalkClip)
            .reset()
            .fadeIn(0.5)
            .play();

          setTimeout(
            () => {
              const randomIdleClip =
                idleClips[Math.floor(Math.random() * idleClips.length)];
              talkAction.crossFadeTo(
                mixer.clipAction(randomIdleClip).reset().play(),
                0.5,
                true,
              );
            },
            randomTalkClip.duration * 1000 - 500,
          );
        }
      };

      const handleAudioError = (e: Event) => {
        console.error("Error loading audio:", e);
      };

      const handleAbort = () => {
        console.warn("Audio play was aborted.");
      };

      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      audio.addEventListener("error", handleAudioError);
      audio.removeEventListener("abort", handleAbort);

      return () => {
        if (audio) {
          audio.removeEventListener("canplaythrough", handleCanPlayThrough);
          audio.removeEventListener("error", handleAudioError);
          audio.removeEventListener("abort", handleAbort);
          URL.revokeObjectURL(audio.src);
        }
      };
    } else {
      setAudioReady(false);
      if (gltf) {
        const expressionManager = (gltf.userData.vrm as VRM)?.expressionManager;
        if (expressionManager) {
          expressionManager.resetValues();
        }
      }
    }
    // Dependencies adjusted to avoid unnecessary re-renders
  }, [audioBlob, blendShapes, gltf, audioRef, talkClips, idleClips, mixer]);

  // Frame update for animations and blend shapes synchronization
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }

    // Synchronize blend shapes with audio
    if (audioRef.current && audioReady && processedFrames.length > 0 && gltf) {
      const audio = audioRef.current;
      const currentTime = audio.currentTime;
      const duration = audio.duration;

      if (isNaN(duration) || duration === 0) {
        console.log("Audio duration not available yet");
        return;
      }

      const totalFrames = processedFrames.length;
      const durationPerFrame = duration / totalFrames;
      const currentFrameIndex = Math.floor(currentTime / durationPerFrame);
      const frameIndex = Math.min(currentFrameIndex, totalFrames - 1);

      const currentFrame = processedFrames[frameIndex];

      if (currentFrame) {
        const expressionManager = (gltf.userData.vrm as VRM)?.expressionManager;
        if (expressionManager) {
          // Apply blend shape values
          currentFrame.blendShapeValues.forEach(
            (value: number, index: number) => {
              const blendShapeName = getBlendShapeKey(index + 1);
              if (blendShapeName) {
                expressionManager.setValue(
                  avatarKey === "woman-2" || avatarKey === "dogwifhat-sit"
                    ? blendShapeName.charAt(0).toLowerCase() +
                        blendShapeName.slice(1)
                    : blendShapeName,
                  avatarKey === "woman-2" ? value * 0.5 : value,
                );
              }
            },
          );

          // Update the blendShape weights once per frame
          expressionManager.update();
        }
      }

      // Reset blend shapes when the audio ends
      if (currentTime >= duration) {
        const expressionManager = (gltf.userData.vrm as VRM)?.expressionManager;
        if (expressionManager) {
          expressionManager.resetValues();
          expressionManager.update();
        }
      }
    }

    const expressionManager = (gltf?.userData.vrm as VRM)?.expressionManager;
    if (expressionManager) {
      expressionManager.update();
    }
  });

  return gltf && idleClips.length > 0 ? (
    <Suspense fallback={null}>
      <primitive
        object={gltf.scene}
        position={position}
        scale={scale}
        rotation={rotation}
      />
    </Suspense>
  ) : null;
};

export default VrmAvatar;
