"use client";

import { useEffect, useState } from "react";
import {
  DocumentCameraTypes,
  MainView,
  SelfieCameraTypes,
} from "./types/unico";

async function getUnicoConfig() {
  const { UnicoConfig } = await import("unico-webframe");
  const config = new UnicoConfig()
    .setProjectNumber("125176493860621304290")
    .setProjectId("front-captacao-loja")
    .setMobileSdkAppId("3:526108:js")
    .setHostname("http://localhost:3000")
    .setHostInfo(
      "nRMqSJJeWMZ0K4n9Dxs/Zhb5RslAxes+pmH0gJgmVtYUGOY3bRieG1JVkSC2iaO/"
    )
    .setHostKey(
      "NNkCEh02WITHLog/0Q0mfKx2drNyHc3H2HahBPAeg97dQ7m/LQgPa4gWiSotl1mW"
    );
  return config;
}

interface UnicoState {
  loading: boolean;
  builder: MainView | null;
  config: any;
  selfieTypes: SelfieCameraTypes | null;
  documentTypes: DocumentCameraTypes | null;
}

export const useUnico = () => {
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [unicoState, setUnicoState] = useState<UnicoState>({
    loading: true, // Initial state indicating loading
    builder: null,
    config: null,
    selfieTypes: null,
    documentTypes: null,
  });

  useEffect(() => {
    (async () => {
      const UnicoSDK = await import("unico-webframe");

      try {
        if (typeof navigator !== "undefined" && typeof window !== "undefined") {
          const config = await getUnicoConfig();
          const builder = new UnicoSDK.UnicoCheckBuilder()
            .setTheme(
              new UnicoSDK.UnicoThemeBuilder()
                .setBackgroundColorBoxMessage("#fff")
                .setColorTextBoxMessage("#202AD0")
                .build()
            )
            .setModelsPath("http://localhost:3000/models")
            .setResourceDirectory("/resources")
            .setEnvironment(UnicoSDK.SDKEnvironmentTypes.UAT)
            .setLocale(UnicoSDK.LocaleTypes.PT_BR)
            .build();

          const cameraTypes = await import("unico-webframe").then((module) => ({
            selfie: module.SelfieCameraTypes,
            document: module.DocumentCameraTypes,
          }));

          setUnicoState({
            loading: false,
            builder,
            config,
            selfieTypes: cameraTypes.selfie,
            documentTypes: cameraTypes.document,
          });
        }
      } catch (error) {
        console.error("Error initializing Unico:", error);
        // Handle errors (e.g., display an error message)
      }
    })();
  }, []);

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  return {
    unicoState,
    showCamera,
    openCamera,
    closeCamera,
  };
};
