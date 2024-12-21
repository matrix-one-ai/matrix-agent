import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { mixamoVRMRigMap } from "./mixamoVRMRigMap";
import { VRM, VRMHumanBoneName } from "@pixiv/three-vrm";
import {
  AnimationClip,
  Quaternion,
  Vector3,
  QuaternionKeyframeTrack,
  VectorKeyframeTrack,
  KeyframeTrack,
  Group,
  Object3D,
} from "three";

export async function loadMixamoAnimation(
  url: string,
  vrm: VRM
): Promise<AnimationClip> {
  const loader = new FBXLoader();
  const asset = (await loader.loadAsync(url)) as Group & {
    animations: AnimationClip[];
  };

  const clip = AnimationClip.findByName(asset.animations, "mixamo.com");
  if (!clip) {
    throw new Error('AnimationClip "mixamo.com" not found');
  }

  // Disable root motion
  clip.tracks = clip.tracks.filter(
    (track) => !track.name.includes(".position")
  );

  const tracks: KeyframeTrack[] = [];

  const restRotationInverse = new Quaternion();
  const parentRestWorldRotation = new Quaternion();
  const _quatA = new Quaternion();
  const _vec3 = new Vector3();

  // Adjust with reference to hips height.
  const hips = asset.getObjectByName("mixamorigHips");
  if (!hips) {
    throw new Error("mixamorigHips not found in asset");
  }

  const motionHipsHeight = hips.position.y;

  const vrmHipsNode = vrm.humanoid?.getNormalizedBoneNode("hips");
  if (!vrmHipsNode) {
    throw new Error("VRM hips bone not found");
  }

  const vrmHipsY = vrmHipsNode.getWorldPosition(_vec3).y;
  const vrmRootY = vrm.scene.getWorldPosition(_vec3).y;
  const vrmHipsHeight = Math.abs(vrmHipsY - vrmRootY);
  const hipsPositionScale = vrmHipsHeight / motionHipsHeight;

  clip.tracks.forEach((track) => {
    // Convert each track for VRM use and push to `tracks`
    const [mixamoRigName, propertyName] = track.name.split(".");

    if (mixamoRigName in mixamoVRMRigMap) {
      const vrmBoneName =
        mixamoVRMRigMap[mixamoRigName as keyof typeof mixamoVRMRigMap];

      const vrmNode = vrm.humanoid?.getNormalizedBoneNode(
        vrmBoneName as VRMHumanBoneName
      );
      if (!vrmNode) return;

      const vrmNodeName = vrmNode.name;
      const mixamoRigNode = asset.getObjectByName(mixamoRigName) as Object3D;
      if (!mixamoRigNode || !mixamoRigNode.parent) return;

      // Store rotations of rest-pose.
      mixamoRigNode.getWorldQuaternion(restRotationInverse).invert();
      mixamoRigNode.parent.getWorldQuaternion(parentRestWorldRotation);

      if (track instanceof QuaternionKeyframeTrack) {
        // Retarget rotation of mixamoRig to NormalizedBone.
        const values = track.values.slice();
        for (let i = 0; i < values.length; i += 4) {
          const flatQuaternion = values.slice(i, i + 4);

          _quatA.fromArray(flatQuaternion);
          _quatA
            .premultiply(parentRestWorldRotation)
            .multiply(restRotationInverse);
          _quatA.toArray(flatQuaternion);

          flatQuaternion.forEach((v, index) => {
            values[index + i] = v;
          });
        }

        const mappedValues = values.map((v, i) =>
          vrm.meta?.metaVersion === "0" && i % 2 === 0 ? -v : v
        );

        tracks.push(
          new QuaternionKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            mappedValues
          )
        );
      } else if (track instanceof VectorKeyframeTrack) {
        const values = track.values.map(
          (v, i) =>
            (vrm.meta?.metaVersion === "0" && i % 3 !== 1 ? -v : v) *
            hipsPositionScale
        );

        tracks.push(
          new VectorKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            values
          )
        );
      }
    }
  });

  return new AnimationClip("vrmAnimation", clip.duration, tracks);
}
