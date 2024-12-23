// src/components/HoveringDetailedCard.tsx
import Image from 'next/image';
import React from 'react';
import foto from './sitting.jpg';
import { Inter, Roboto, Montserrat } from 'next/font/google'
import { auto } from 'openai/_shims/registry.mjs';
const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})
const montserrat = Montserrat({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})

export default function HoveringDetailedCard({ PoseName, PoseDescription, PoseSteps, Precautions, Benefits, closeModal, imageUrl }: any) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black  px-5 backdrop-blur-lg bg-opacity-25 ">
            {/* <div className="relative bg-[#0d0d0d] text-white rounded-lg w-11/12 md:w-full lg:w-full max-h-full overflow-auto p-1 "> */}
            <div className="relative bg-[#0d0d0d] text-white rounded-lg w-11/12 md:w-full lg:w-full max-h-full overflow-auto bg-opacity-70 p-2 mt-32 md:mt-0">
                {/* <div className="relative bg-white rounded-lg w-11/12 md:w-4/5 lg:w-1/2 max-h-full overflow-auto p-1"> */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="ml-5 text-xl font-bold text-white">{PoseName}</h1>
                    <button onClick={closeModal} className="text-red-500 text-xl font-bold">X</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left Column */}
                    <div className="flex flex-col bg-[#1a1a1a] bg-opacity-50 uppercase text-gray-800 border-b-2 border-gray-900 rounded-lg  p-1 lg:col-span-1 md:col-span-1 justify-center content-center">
                        {/* <div className=" bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-lg  p-1 flex content-center justify-center"> */}
                        <Image src={imageUrl? imageUrl:foto}
                        alt={PoseName} width={5000} height={5000} className="object-cover w-auto h-64 md:h-80 lg:h-auto max-h-full p-1" />

                    </div>
                    {/* Right Column */}
                    <div className="flex flex-col lg:col-span-2 md:col-span-2">
                        <div className="flex-grow  bg-opacity-50  mb-1 rounded-lg p-2">
                            <h1 className="text-lg font-bold mb-2 text-[#e8e8e8] ">Description:</h1>
                            <div className={`'mb-2 text-[#9b958c] ${montserrat.className}'`} >
                                {PoseDescription}
                            </div>
                            <h1 className="text-lg font-bold mb-2 text-[#e8e8e8]">How To Do?</h1>
                            <ul className={`text-base list-disc px-3 text-[#9b958c] ${roboto.className}`}>
                                {PoseSteps.map((step: string, index: number) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className="text-base mb-4 h-full bg-[#1a1a1a] bg-opacity-50 border-b-4 border-[#262626] rounded-lg shadow-xl p-5 col-span-1">
                                <div className="mb-4 ">
                                    <h1 className="text-l font-bold mb-2 ">Benefits:</h1>
                                    <ul className="list-disc ">
                                        {Benefits.map((benefit: string, index: number) => (
                                            <li className={`${montserrat.className}  text-[#9b958c]`} key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="p-5 rounded-lg bg-[#1a1a1a] bg-opacity-50 border-b-4 border-[#262626] shadow-xl h-full col-span-1">

                                {Precautions && Precautions.length > 0 &&
                                    <div>
                                        <h1 className="text-l font-bold mb-2 ">Precautions:</h1>
                                        <ul className="list-disc list ">
                                            {Precautions.map((precaution: string, index: number) => (
                                                <li className={`${montserrat.className}  text-[#9b958c]`} key={index}>{precaution}</li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// import Image from 'next/image'
// import React from 'react'
// import foto from './sitting.jpg'

// export default function HoveringDetailedCard({ PoseName, PoseDescription, PoseSteps, Precautions, Benefits, closeModal }: any) {
//     return (
//         <div className=" p-4 rounded w-full md:h-2/3 md:w-2/3 object-contain bg-green-500 bg-opacity-30 backdrop-blur-lg  ">
//             <div className="flex justify-between">
//                 <h1 className="text-xl font-bold text-white">{PoseName}</h1>
//                 <button onClick={closeModal} className="text-red-500 text-xl font-bold">X</button>
//             </div>

//             <div className="grid grid-col-1 md:grid-cols-2 gap-4 p-4  bg-white  ">
//                 {/* Left Column */}

//                 <div className="flex flex-col">

//                     <div className="flex-grow h-2/3 bg-gray-300">
//                         {/* Replace the src with the actual image source */}
//                         <Image src={foto} alt={PoseName} className="object-cover h-full w-full" />
//                     </div>
//                     <div className="Description">
//                         <p className="text-gray-700 text-base">{PoseDescription}</p>
//                     </div>

//                 </div>
//                 {/* Right Column */}
//                 <div className="flex flex-col">
//                     <div className="flex-grow bg-blue-200 bg-opacity-50 p-4">
//                         <h1 className="text-xl font-bold">Follow These steps: </h1>
//                         <ul className="text-gray-700 text-base">
//                             {PoseSteps.map((step: string, index: number) => (
//                                 <li key={index}>{index + 1}. {step}</li>
//                             ))}
//                         </ul>
//                     </div>
//                     <div className="bg-gray-100 p-4 flex  flex-col">

//                         <div className="benefits">
//                             <h1 className="text-l font-bold">Benefits:</h1>
//                             <ul>
//                                 {Benefits.map((benefit: string, index: number) => (
//                                     <li className='italic text-green-500' key={index}>{index + 1}. {benefit}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                         { }
//                         {(Precautions !== undefined && Precautions !== null && Precautions !== "" && Precautions.length > 0) &&
//                             <div className="precautions">
//                                 <h1 className="text-l font-bold">Precautions<span className='text-red-500'>*</span>:</h1>
//                                 <p className="text-gray-700  text-sm ">{Precautions}</p>
//                             </div>
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>

//     )
// }

