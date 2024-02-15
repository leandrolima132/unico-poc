"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Criação do contexto Unico
export const UnicoContext = createContext({} as any);

// Provedor do Contexto Unico
export function UnicoProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const unicoThemeRef = useRef<any>();
  const unicoBuilderRef = useRef<any>();

  const selfieTypeRef = useRef<any>();
  const documentTypeRef = useRef<any>();
  const configRef = useRef<any>();

  const callback = {
    on: {
      success: (obj: { base64: any; encrypted: any }) => {
        console.log(obj.base64);
        console.log(obj.encrypted);
      },
      error: (error: { message: any; code: number; stack: any }) => {
        alert(error.message);
        console.log("callback error", error);
        window.alert(`
        Câmera fechada
        ------------------------------------
        Motivo: ${error.code} - ${error.message} ${JSON.stringify(error.stack)}
    `);
      },
    },
  };

  const prepareSelfieCamera = async () => {
    await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    try {
      if (
        !unicoBuilderRef.current ||
        !configRef.current ||
        !selfieTypeRef.current
      ) {
        throw new Error("UnicoBuilder, config, or selfieType not available");
      }

      const cameraOpener = await unicoBuilderRef.current.prepareSelfieCamera(
        configRef.current,
        selfieTypeRef.current.SMART
      );
      console.log("cameraOpener");
      setShowCamera(true);
      cameraOpener.open(callback);
    } catch (error: any) {
      alert(error.message);
      console.error("Error preparing selfie camera:", error);
    } finally {
      console.log("finalizou - prepareSelfieCamera");
    }
  };

  const prepareDocumentCamera = async () => {
    try {
      if (!unicoBuilderRef) {
        console.log("Error - prepareDocumentCamera");
        return;
      }
    } catch (error) {}
  };

  // Função assíncrona para preparar o ambiente Unico
  const prepareEnvironment = async () => {
    const {
      UnicoCheckBuilder,
      UnicoThemeBuilder,
      SelfieCameraTypes,
      DocumentCameraTypes,
      SDKEnvironmentTypes,
      LocaleTypes,
      UnicoConfig,
    } = await import("unico-webframe");

    unicoThemeRef.current = new UnicoThemeBuilder()
      .setColorSilhouetteSuccess("#d98888")
      .setColorSilhouetteError("#D50000")
      .setColorSilhouetteNeutral("#432424")
      .setBackgroundColor("#b91515")
      .setColorText("#df5959")
      .setBackgroundColorComponents("#e16060")
      .setColorTextComponents("#dff1f5")
      .setBackgroundColorButtons("#e55d5d")
      .setColorTextButtons("#dff1f5")
      .setBackgroundColorBoxMessage("#fff")
      .setColorTextBoxMessage("#ea7474")
      .setHtmlPopupLoading(
        `<div style="position: absolute; top: 45%; right: 50%; transform: translate(50%, -50%); z-index: 10; text-align: center;">Carregandooooo...</div>`
      )
      .build();

    unicoBuilderRef.current = new UnicoCheckBuilder()
      .setTheme(unicoThemeRef.current)
      .setModelsPath("http://localhost:3000/models")
      .setResourceDirectory("http://localhost:3000/resources")
      .setEnvironment(SDKEnvironmentTypes.UAT)
      .setLocale(LocaleTypes.PT_BR)
      .build();

    // Após a inicialização do ambiente, chame prepareSelfieCamera
    configRef.current = new UnicoConfig()
      .setProjectNumber("125176493860621304290")
      .setProjectId("front-captacao-loja")
      .setMobileSdkAppId("3:3255998:js")
      .setHostname("https://www.sitdm.net")
      .setHostInfo(
        "nRMqSJJeWMZ0K4n9Dxs/Zhb5RslAxes+pmH0gJgmVtYUGOY3bRieG1JVkSC2iaO/"
      )
      .setHostKey(
        "NNkCEh02WITHLog/0Q0mfKx2drNyHc3H2HahBPAeg97dQ7m/LQgPa4gWiSotl1mW"
      );

    selfieTypeRef.current = SelfieCameraTypes;
    documentTypeRef.current = DocumentCameraTypes;

    // Indica que o ambiente está inicializado
    setIsInitialized(true);
  };

  useEffect(() => {
    const initializeEnvironment = async () => {
      await prepareEnvironment();
    };

    initializeEnvironment();
  }, []);

  if (!isInitialized) {
    return (
      <main className="flex min-h-screen items-center ">
        <div className="mx-auto">Loading...</div>
      </main>
    );
  }

  // Provedor fornece o valor do contexto para os componentes filhos
  return (
    <UnicoContext.Provider value={{ prepareSelfieCamera, showCamera }}>
      {children}
    </UnicoContext.Provider>
  );
}

// Hook customizado para consumir o contexto Unico
export const useUnico = () => useContext(UnicoContext);
