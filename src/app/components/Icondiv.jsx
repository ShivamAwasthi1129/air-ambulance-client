"use client";
export const Icondiv = ({ flightTypes, setFlightTypes }) => {
   // this function is for multiple option selection 
//   const toggleFlightType = (type) => {
//   if (flightTypes.includes(type)) {
//     if (flightTypes.length === 1) {
//       return;
//     }
//     setFlightTypes(flightTypes.filter((ft) => ft !== type));
//   } else {
//     setFlightTypes([...flightTypes, type]);
//   }
// };


// this function if for single option selection
const toggleFlightType = (type) => {
  setFlightTypes([type]);
};

  // A small helper to generate dynamic CSS classes for an icon's container
  const getIconClasses = (type) => {
    return flightTypes.includes(type)
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-300";
      
  };

  return (
    <div className="flex flex-wrap items-center justify-around gap-3 mb-4 w-1/2 bg-white rounded-xl border-2 border-gray-300 p-2 -mt-20">
      {/* Private Jet */}
      <div
        onClick={() => toggleFlightType("Private Jet")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${getIconClasses("Private Jet")}`}
      >
        <span className="cursor-pointer">
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 678.6"
            width="40"
            height="40"
            className="fill-current"
          >
            <path
              fill="currentColor"
              d="M59.18,395.82l162.83,149.98s27.85,40.71,132.84,0c104.98-40.71,630.77-307.82,630.77-307.82,0,0,99.29-60.16,1.27-99.26-122.12-23.99-209.97,8.57-317.09,87.84-141.41-47.14-359.94-132.84-437.07-107.13-30,12.86-15,49.28,23.57,72.85,38.57,23.57,152.12,100.7,152.12,100.7,0,0,44.99,26.24,21.43,46.33-23.57,20.09-87.84,69.37-87.84,69.37,0,0-49.28,12.86-81.42,2.14-32.14-10.71-160.69-49.28-184.26-51.42-23.57-2.14-36.3,18.78-17.14,36.42Z"
            />
          </svg>
        </span>
        <span className="text-[13px] m-0">Private Jet</span>
      </div>

      {/* Helicopter */}
      <div
        onClick={() => toggleFlightType("Helicopter")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${getIconClasses("Helicopter")}`}
      >
        <span className="cursor-pointer">
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 678.6"
            width="40"
            height="40"
            className="fill-current"
          >
             <path
              fill="currentColor"
              d="M920.08,488.87v-74.33c0-160.82-188.44-199.29-188.44-199.29h-107.16v-57.85h-102.82v57.85H236.75l-21.55-92.12h-87.78l15.33,164.14h242.53s54.67,130.16,77.23,175.13c22.42,44.98,61.32,44.25,61.32,44.25h360.97c36.16,0,35.29-17.79,35.29-17.79ZM720.07,391.11v-142.88c141.44,17.64,157.49,142.88,157.49,142.88h-157.49Z"
            />
            <path
              fill="currentColor"
              d="M865.24,56.02H270.7c-11.98,0-21.69-9.71-21.69-21.69s9.71-21.69,21.69-21.69h594.55c11.98,0,21.69,9.71,21.69,21.69s-9.71,21.69-21.69,21.69Z"
            />
            <path
              fill="currentColor"
              d="M567.97,124.7c-11.98,0-21.69-9.71-21.69-21.69V34.33c0-11.98,9.71-21.69,21.69-21.69s21.69,9.71,21.69,21.69v68.67c0,11.98-9.71,21.69-21.69,21.69Z"
            />
            <path
              fill="currentColor"
              d="M372.46,578.11h46.6v32.14h130.16v-41.78h43.39v41.78h127.46v-41.78h49.29v41.78h141.41v-28.92h41.78v38.57s3.21,44.99-57.85,44.99h-454.75s-67.49,11.25-67.49-38.57v-48.21Z"
            />
          </svg>
        </span>
        <span className="text-[13px] m-0">Helicopter</span>
      </div>

      {/* Air Ambulance */}
      <div
        onClick={() => toggleFlightType("Air Ambulance")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${getIconClasses("Air Ambulance")}`}
      >
        <span className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 678.6"
            width="40"
            height="40"
            className="fill-current"
          >
              <path
              fill="currentColor"
              d="M954.55,43.39H147.89c-11.98,0-21.69-9.71-21.69-21.69S135.91,0,147.89,0h806.66c11.98,0,21.69,9.71,21.69,21.69s-9.71,21.69-21.69,21.69Z"
            />
            <path
              fill="currentColor"
              d="M144.91,222.51c0,14.03-11.42,25.45-25.45,25.45s-25.45-11.42-25.45-25.45,11.42-25.45,25.45-25.45,25.45,11.42,25.45,25.45Z"
            />
            <path
              fill="currentColor"
              d="M551.21,170.06c-15.97,0-28.92-12.95-28.92-28.92V31.87c0-15.97,12.95-28.92,28.92-28.92s28.92,12.95,28.92,28.92v109.27c0,15.97-12.95,28.92-28.92,28.92Z"
            />
            <rect fill="currentColor" x="513.69" y="561.88" width="361.59" height="43.39" />
            <rect fill="currentColor" x="589.18" y="498.94" width="28.92" height="84.63" />
            <rect fill="currentColor" x="767.61" y="498.94" width="28.92" height="84.63" />
            <path
              fill="currentColor"
              d="M673.35,200.1c0-83.59-41.8-76.36-41.8-76.36h-228.21c-36.88,0-33.7,45.84-33.7,45.84v30.51h-130.16C202.47,68.35,78.82,105.23,78.82,105.23v-57.85H0v142.02C0,287.3,39.19,345.15,121.05,345.15s96.46-46.57,96.46-46.57h131.75s54.67,106.15,102.39,160.67c47.58,54.67,111.36,59.44,111.36,59.44h241.08c88.36,0,99.07-46.57,99.07-46.57v-92.12c-82-205.65-229.8-179.91-229.8-179.91ZM119.46,291.35c-37.89,0-68.84-30.8-68.84-68.84s30.95-68.84,68.84-68.84,68.84,30.95,68.84,68.84-30.8,68.84-68.84,68.84ZM603.64,348.91h-60.6v60.6h-58.72v-60.6h-60.6v-58.86h60.6v-60.6h58.72v60.6h60.6v58.86ZM690.42,374.07l-34.27-115.7s155.9-44.98,192.92,115.7h-158.65Z"
            />
          </svg>
        </span>
        <span className="text-[13px] m-0">Air Ambulance</span>
      </div>

      {/* Air Cargo */}
      <div
        onClick={() => toggleFlightType("Air Cargo")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${getIconClasses("Air Cargo")}`}
      >
        <span className="cursor-pointer">
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 678.6"
            width="40"
            height="40"
            className="fill-current"
          >
             <path
              fill="currentColor"
              d="M756.34,19.57c38.47-16.92,113.53-37.6,191.77,8.68.58,0,1.16-.14,1.74,0-21.11,29.21-55.24,48.16-93.86,48.16-42.37,0-79.4-22.85-99.64-56.84Z"
            />
            <path
              fill="currentColor"
              d="M979.92,35.04c-25.31,42.08-71.44,70.29-123.94,70.29s-100.22-29.21-125.24-72.45c-.72.43-1.16.72-1.16.72l-399.01,206.95c-32.4,17.93-51.48-2.17-51.48-2.17,0,0-57.85-51.34-86.77-80.26-28.92-28.92-48.16-4.34-48.16-4.34l-26.76,23.57c-19.23,16.92-11.28,33.26-11.28,33.26,0,0,73.9,152.57,107.6,188.01,33.84,35.29,107.74,28.92,141.44,12.87,23.14-10.99,78.96-45.99,111.65-66.81l15.62-71.73s10.41-30.51,11.14,0c.43,13.88,0,34.56-1.74,55.68v.14c0,3.76.72,64.07.72,106.73s28.2,16.92,28.2,16.92l99.5-150.98s61.61-94.29,88.94-129.72c27.33-35.29,17.64,0,17.64,0l-34.42,88.36,21.11-12s248.46-129.87,272.03-164.14c15.18-22.13,9.54-39.63-5.64-48.88Z"
            />
            <path
              fill="currentColor"
              d="M376.14,292.03c-15.18,0-27.33-12.29-27.33-27.33s12.15-27.33,27.33-27.33,27.19,12.29,27.19,27.33-12.15,27.33-27.19,27.33Z"
            />
            <path
              fill="currentColor"
              d="M462.04,250.24c-15.04,0-27.33-12.29-27.33-27.33s12.29-27.33,27.33-27.33,27.33,12.29,27.33,27.33-12.29,27.33-27.33,27.33Z"
            />
            <path
              fill="currentColor"
              d="M547.94,208.44c-15.04,0-27.19-12.29-27.19-27.33s12.15-27.33,27.19-27.33,27.33,12.29,27.33,27.33-12.15,27.33-27.33,27.33Z"
            />
            <path
              fill="currentColor"
              d="M633.99,166.65c-15.04,0-27.33-12.15-27.33-27.33s12.29-27.33,27.33-27.33,27.33,12.29,27.33,27.33-12.29,27.33-27.33,27.33Z"
            />
            <path
              fill="currentColor"
              d="M719.9,124.85c-15.04,0-27.33-12.15-27.33-27.33s12.29-27.33,27.33-27.33,27.33,12.29,27.33,27.33-12.15,27.33-27.33,27.33Z"
            />
            <path
              fill="currentColor"
              d="M414.1,166.65l106.66-54.67s20.82-15.62-18.82-21.52-118.8-4.82-153.14,0-38.62,26.25-10.77,38.57c27.85,12.32,61.06,30,61.06,30l15,7.62Z"
            />
            <rect fill="currentColor" x="738.7" y="286.54" width="107.16" height="111.07" />
            <path
              fill="currentColor"
              d="M860.32,286.54v125.53h-136.09v-125.53h-61.17l-59.29,93.14v282.88l16.05,16.05h347.09l14.03-13.88v-378.18h-120.61ZM924.25,560.74h-263.79v-21.69h263.79v21.69ZM924.25,519.81h-263.79v-42.66h263.79v42.66Z"
            />
            <path
              fill="currentColor"
              d="M92.72,567.97c-2.53,0-4.98-1.32-6.31-3.68-1.96-3.47-.73-7.89,2.75-9.85l187.47-105.77c3.49-1.96,7.89-.73,9.85,2.75,1.96,3.47.73,7.89-2.75,9.85l-187.47,105.77c-1.12.64-2.34.93-3.54.93Z"
            />
            <path
              fill="currentColor"
              d="M202.9,573.77c-2.53,0-4.98-1.32-6.31-3.68-1.96-3.47-.73-7.89,2.75-9.85l187.47-105.77c3.49-1.98,7.89-.73,9.85,2.75,1.96,3.47.73,7.89-2.75,9.85l-187.47,105.77c-1.12.64-2.34.93-3.54.93Z"
            />
            <path
              fill="currentColor"
              d="M171.44,652.05c-2.53,0-4.98-1.32-6.31-3.68-1.96-3.47-.73-7.89,2.75-9.85l187.47-105.77c3.48-1.98,7.89-.73,9.85,2.75,1.96,3.47.73,7.89-2.75,9.85l-187.47,105.77c-1.12.64-2.34.93-3.54.93Z"
            />
          </svg>
        </span>
        <span className="text-[13px] m-0">Air Cargo</span>
      </div>

      {/* Sea Plane */}
      <div
        onClick={() => toggleFlightType("Sea Plane")}
        className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-colors ${getIconClasses("Sea Plane")}`}
      >
        <span className="cursor-pointer">
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 678.6"
            width="40"
            height="40"
            className="fill-current"
          >
           <g>
              <path
                fill="currentColor"
                d="M1010.57,224.95s-45.12,2.17-143.61,0c-61.03-16.05-128.57-26.75-154.31-28.92-24.59-2.17-93.14-20.39-153.15-12.87-60.02,7.52-217.51,64.21-205.65,74.91,11.71,10.7,65.37,11.86,65.37,11.86v25.45l-63.2-1.3s-60.02,6.36-120.04-8.68c-98.49-27.77-118.3-84.02-142.45-122.64-24.15-38.61-46.57-32.11-46.57-32.11H8.36c-18.8,0,0,56.69,0,56.69l34.85,178.46s16.63,12.87,76.5,21.4c306.45,23.57,519.04.58,700.11-32.68,183.23-34.27,218.52-98.49,218.52-115.7s-27.77-13.88-27.77-13.88Z"
              />
              <path
                fill="currentColor"
                d="M490.95,312.15h-47.15v-43.82h47.15v43.82ZM576.13,296.1h-47.15v-43.82h47.15v43.82ZM662.91,274.12h-47.15v-43.82h47.15v43.82ZM707.02,263.56v-43.24c85.76-9.83,100.95,29.79,100.95,29.79l-100.95,13.45Z"
              />
            </g>
            <path
              fill="currentColor"
              d="M1021.33,86.09c7.46,101.5,26.95,200.86,57.85,297.81,5.84,18.17-21.17,27.49-27.65,9.35-8.75-102.61-26.66-203.54-58.59-301.64-6.27-20.81,26.33-27.35,28.39-5.52h0Z"
            />
            <path
              fill="currentColor"
              d="M150.56,499.15s683.46-70.7,758.45-74.99c74.99-4.29,141.8-4.29,107.32,30-34.47,25.71-218.19,98.56-400.57,104.98-240.36,11.98-443.77-25.71-443.77-25.71,0,0-93.51-26.85-21.43-34.28Z"
            />
            <rect fill="currentColor" x="769.68" y="335.78" width="10.85" height="126.95" />
            <rect fill="currentColor" x="867.7" y="335.78" width="10.85" height="126.95" />
            <rect
              fill="currentColor"
              x="774.63"
              y="387"
              width="98.97"
              height="10.85"
              transform="translate(-46.26 117.45) rotate(-7.93)"
            />
            <rect fill="currentColor" x="320.97" y="363.73" width="10.85" height="126.95" />
            <rect fill="currentColor" x="418.99" y="363.73" width="10.85" height="126.95" />
            <rect
              fill="currentColor"
              x="325.92"
              y="414.95"
              width="98.97"
              height="10.85"
              transform="translate(-54.41 55.81) rotate(-7.93)"
            />
            <path
              fill="currentColor"
              d="M567.73,584.68c-108.42,0-210.36-2.37-287.03-6.67-37.3-2.09-66.59-4.53-87.05-7.25-29.04-3.85-32.76-7.29-32.76-9.86s3.72-6,32.76-9.86c20.47-2.72,49.75-5.15,87.05-7.25,76.67-4.3,178.61-6.67,287.03-6.67s210.36,2.37,287.03,6.67c37.3,2.09,66.59,4.53,87.05,7.25,29.04,3.85,32.76,7.29,32.76,9.86s-3.72,6-32.76,9.86c-20.47,2.71-49.75,5.15-87.05,7.25-76.67,4.3-178.61,6.67-287.03,6.67ZM567.73,539.13c-108.39,0-210.28,2.37-286.92,6.67-112.24,6.3-117.93,13.69-117.93,15.11s5.69,8.81,117.93,15.11c76.64,4.3,178.53,6.67,286.92,6.67s210.29-2.37,286.92-6.67c112.24-6.3,117.93-13.69,117.93-15.11s-5.69-8.81-117.93-15.11c-76.64-4.3-178.54-6.67-286.92-6.67ZM567.73,572.46c-47.91,0-92.95-1.05-126.83-2.95-53.92-3.03-53.92-6.52-53.92-8.61s0-5.58,53.92-8.61c33.88-1.9,78.92-2.95,126.83-2.95s92.95,1.05,126.83,2.95c53.92,3.03,53.92,6.52,53.92,8.61s0,5.58-53.92,8.61c-33.88,1.9-78.92,2.95-126.83,2.95ZM390.58,560.91c8.86,4.22,79.67,8.56,177.15,8.56s168.29-4.34,177.15-8.56c-8.86-4.22-79.67-8.56-177.15-8.56s-168.29,4.34-177.15,8.56Z"
            />
            <path
              fill="currentColor"
              d="M567.73,606.06c-131.46,0-255.06-3.61-348.02-10.17-53.96-3.81-144.49-12.11-144.49-24.92s90.53-21.12,144.49-24.92c92.96-6.56,216.56-10.17,348.02-10.17s255.06,3.61,348.02,10.17c53.96,3.81,144.49,12.11,144.49,24.92s-90.53,21.12-144.49,24.92c-92.96,6.56-216.56,10.17-348.02,10.17ZM567.73,536.62c-131.45,0-255.02,3.61-347.96,10.17-91.38,6.45-143.79,15.26-143.79,24.18s52.41,17.73,143.79,24.18c92.94,6.56,216.52,10.17,347.96,10.17s255.02-3.61,347.97-10.17c91.38-6.45,143.79-15.26,143.79-24.18s-52.41-17.73-143.79-24.18c-92.94-6.56-216.52-10.17-347.97-10.17Z"
            />
          </svg>
        </span>
        <span className="text-[13px] m-0">Sea Plane</span>
      </div>
    </div>
  );
};
