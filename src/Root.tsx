import React from "react";
import { Composition, Folder } from "remotion";
import { Chapter1Hook } from "./SpiderVerse/Chapter1Hook";
import { Chapter2Volcano } from "./SpiderVerse/Chapter2Volcano";
import { HelloWorld } from "./HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Chapter1-Tilt-Hook"
        component={Chapter1Hook}
        durationInFrames={2280}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="Chapter2-Tilt-Volcano"
        component={Chapter2Volcano}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
      />

      <Folder name="StarterTemplate">
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
    </>
  );
};
