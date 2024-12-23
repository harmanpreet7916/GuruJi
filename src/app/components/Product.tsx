// src/pages/Product.tsx
"use client";
import { useEffect, useState } from 'react';
import YogaCard from "../components/Card";
import StateStore from "../states/StateStore";
import HoveringDetailedCard from '../components/HoveringDetailedCard';
import HeroImage from '../components/assets/HeroImage.png';
import Image from 'next/image';
interface YogaPose {
  PoseName: string;
  PoseDescription: string;
  PoseSteps: string[];
  Precautions: string[];
  Benefits: string[];
  url: string;

}

export default function ProductPage() {
  const [diseaseDescription, setDiseaseDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<YogaPose | undefined | null>(null);
  const [fadeClass, setFadeClass] = useState<string>('fade-in');
  const { responseArray, setResponseArray, selectedCard, setSelectedCard } = StateStore();
  const [poseImages, setPoseImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  //fadeout effect
  useEffect(() => {
    if (responseArray) {
      const data = responseArray!.find(p => p.PoseName === selectedCard);
      setFadeClass('fade-in');
      setSelectedPhoto(data);

    }
  }, [selectedCard]);

  // const getPoses = async () => {
  //   if (!isLoading) {
  //     setIsLoading(true);
  //     try {
  //       const diseaseCures = await fetch("/api/cures", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           diseaseDescription: diseaseDescription
  //         }),
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       });

  //       const response = await diseaseCures.json();
  //       const poseNames = response.posesArray.map((pose: YogaPose) => pose.PoseName);

  //       // Fetch image URLs for the pose names
  //       const imageResponse = await fetch(`/api/s3?poseNames=${poseNames.join(',')}`);
  //       // const imagesData = await imageResponse.json();
  //       console.log(imageResponse);

  //       setResponseArray(response.posesArray); // Store the poses
  //       // setPoseImages(); // Store the images
  //       // setPoseImages(imagesData.map((img: { imageUrl: string }) => img.imageUrl)); // Store the images
  //       setDiseaseDescription("");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     setIsLoading(false);
  //     setSelectedCard(null);
  //   }
  // };

  const getPoses = async () => {
    if (!isLoading) {
      setIsLoading(true);
      // pose names and desc from gemini
      try {
        const diseaseCures = await fetch("/api/cures", {
          method: "POST",
          body: JSON.stringify({
            diseaseDescription: diseaseDescription
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        var response = await diseaseCures.json();
        var poseData = response.posesArray;
      } catch (error) {
        console.error(error);
      }
      // pose images from s3
      try {
        // Extract pose names from response
        const poseNames = response.posesArray.map((pose: YogaPose) => pose.PoseName);
        // Fetch image URLs by sending poseNames in the request body (not URL)
        const imageResponse = await fetch(`/api/s3`, {
          method: "POST",
          body: JSON.stringify({ poseNames }),  // Send pose names in the body
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const imagesData = await imageResponse.json();
        const imagesUrls = imagesData.imageUrls;

        // Combine pose data with image URLs
        const poseDataAndUrls = poseData.map((pose: YogaPose, index: number) => {
          return {
            ...pose,
            url: imagesUrls[index]
          };
        });
        console.log(poseDataAndUrls);

        setResponseArray(poseDataAndUrls); // Store the poses
        setPoseImages(imagesData.imageUrls); // Store the images
        setDiseaseDescription("");
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
      setSelectedCard(null);
    }
  };

  const closeModal = () => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setSelectedPhoto(null);
      setSelectedCard(null);
    }, 200); // Match this timeout with the duration of fade-out animation
  };


  useEffect(() => {
    console.log(poseImages)


  }, [poseImages])


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-4 mt-10 md:mt-4 ">
      <h1 className="flex justify-center mb-4">
        <Image src={HeroImage} alt="yoga" className="w-1/2 h-1/2 md:w-1/2 md:h-1/2 inline-block" />
      </h1>
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter your Health Issue..."
          className="px-4 py-2 rounded-full border border-gray-300 w-full md:w-96"
          value={diseaseDescription}
          onChange={(e) => setDiseaseDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              getPoses();
            }
          }}
        />
        <button
          onClick={getPoses}
          className="px-4 py-2 bg-green-700 text-white rounded-full w-full md:w-auto"
        >
          {isLoading ? (
            <div>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          ) : 'Search'}
        </button>
      </div>
      <div>
        {selectedPhoto && (
          <div className={`fixed inset-0 w-full h-full ${fadeClass}  bg-opacity-30 backdrop-blur-lg`}>
            <HoveringDetailedCard
              PoseName={selectedPhoto.PoseName}
              PoseDescription={selectedPhoto.PoseDescription}
              PoseSteps={selectedPhoto.PoseSteps}
              Precautions={selectedPhoto.Precautions}
              Benefits={selectedPhoto.Benefits}
              imageUrl={selectedPhoto.url}
              closeModal={closeModal}

            />
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {responseArray && responseArray.map((pose: YogaPose, index: number) => (
          <YogaCard
            key={index}
            imageUrl={pose.url}
            PoseName={pose.PoseName}
            PoseDescription={pose.PoseDescription}
            PoseSteps={pose.PoseSteps}
            Precautions={pose.Precautions}
            Benefits={pose.Benefits}
            PoseId={index}
            onClick={() => {
              setSelectedCard(pose.PoseName);
              // setSelectedImage(poseImages[index]);
            }} // Add onClick to set selected card
          />
        ))}
      </div>

    </div>
  );

}