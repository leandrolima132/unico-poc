"use client";
import { useUnico } from "@/contexts/unico-context";

export default function Home() {
  const { prepareSelfieCamera, showCamera } = useUnico();

  const handleClick = () => prepareSelfieCamera();

  console.log("showCamera", showCamera);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div
        style={{
          display: showCamera ? "inline" : "none",
        }}
      >
        <div id="box-camera"></div>
      </div>

      {!showCamera && (
        <div className="main-container">
          <main>
            <button type="button" onClick={handleClick}>
              Prepare Selfie Camera
            </button>
          </main>
        </div>
      )}
    </main>
  );
}
