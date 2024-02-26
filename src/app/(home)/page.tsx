"use client";

import { useUnico } from "@/hook/unico-hook";

export default function Home() {
  const { unicoState, showCamera, openCamera, closeCamera } = useUnico();

  async function prepareSelfieCamera() {
    const cameraOpener = await unicoState.builder?.prepareSelfieCamera(
      unicoState.config,
      unicoState.selfieTypes!.SMART
    );

    openCamera();

    if (cameraOpener) {
      cameraOpener.open({
        on: {
          success: (obj: { base64: string; encrypted: any }) => {
            console.log(obj.base64);
            console.log(obj.encrypted);
            closeCamera();
          },
          error: (error: { message: string; code: number; stack: any }) => {
            closeCamera();
            alert(error.message);
          },
        },
      });
    }
  }

  if (unicoState.loading) {
    return <p>Carregando..</p>;
  }

  console.log("showCamera", showCamera);

  return (
    <main className="main-container">
      <div
        style={{
          display: showCamera ? "inline" : "none",
        }}
      >
        <div id="box-camera"></div>
      </div>

      {!showCamera && (
        <div>
          <main>
            <button type="button" onClick={() => prepareSelfieCamera()}>
              Prepare Selfie Camera
            </button>
          </main>
        </div>
      )}
    </main>
  );
}
