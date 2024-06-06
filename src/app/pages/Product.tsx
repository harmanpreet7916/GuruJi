"use client";
import { useEffect, useState } from 'react';
import YogaCard from "../components/Card";
import StateStore from "../states/StateStore";
import HoveringDetailedCard from '../components/HoveringDetailedCard';

interface YogaPose {
    PoseName: string;
    PoseDescription: string;
    PoseSteps: string[];
    Precautions: string[];
    Benefits: string[];
}

export default function ProductPage() {
    const [diseaseDescription, setDiseaseDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<YogaPose | undefined | null>(null);
    const [fadeClass, setFadeClass] = useState<string>('fade-in');
    const { responseArray, setResponseArray, selectedCard, setSelectedCard } = StateStore();

    useEffect(() => {
        if (responseArray) {
            const data = responseArray!.find(p => p.PoseName === selectedCard);
            setFadeClass('fade-in');
            setSelectedPhoto(data);
            if (data) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [selectedCard]);

    const getPoses = async () => {
        if (!isLoading) {
            setIsLoading(true);
            try {
                const diseaseCures = await fetch("api/cures", {
                    method: "POST",
                    body: JSON.stringify({
                        diseaseDescription: diseaseDescription
                    })
                });

                const response = await diseaseCures.json();
                setResponseArray(response.posesArray);
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
        }, 300); // Match this timeout with the duration of fade-out animation
    };

    return (
        <div className="SearchSection flex flex-col items-center overflow-x-hidden">
            <div className="searchForm m-4 mt-10 p-3 w-4/5 flex flex-col items-center gap-y-5">
                <input
                    className="searchBar w-full md:w-2/3 lg:w-1/2 border border-zinc-950 px-4 py-2 rounded-3xl shadow md:shadow-lg hover:border-neutral-50"
                    type="text"
                    placeholder="Explain your health issue here..."
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
                    disabled={isLoading}
                    className={`searchButton px-9 py-1 rounded-3xl bg-[#606C5D] text-white transition duration-200 ease-in-out transform hover:scale-110 hover:bg-[#E1ECC8] hover:text-black shadow-lg disabled:bg-[#606C5D] disabled:cursor-not-allowed disabled:text-[#E1ECC8] disabled:shadow-none disabled:hover:scale-100 disabled:hover:bg-[#606C5D] disabled:hover:text-white disabled:transition-none disabled:ease-none disabled:duration-0 disabled:transform-none`}
                    type="submit"
                    onClick={getPoses}
                >
                    {isLoading ? 'Loading...' : 'Search'}
                </button>
                {selectedPhoto && (
                    <div className={`inset-0 flex justify-center items-center w-full h-full z-0 ${fadeClass}`}>
                        <HoveringDetailedCard
                            PoseName={selectedPhoto.PoseName}
                            PoseDescription={selectedPhoto.PoseDescription}
                            PoseSteps={selectedPhoto.PoseSteps}
                            Precautions={selectedPhoto.Precautions}
                            Benefits={selectedPhoto.Benefits}
                            closeModal={closeModal}
                        />
                    </div>
                )}
                {responseArray && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                        {responseArray.map((pose: YogaPose, index: number) => (
                            <YogaCard
                                key={index}
                                PoseName={pose.PoseName}
                                PoseDescription={pose.PoseDescription}
                                PoseSteps={pose.PoseSteps}
                                Precautions={pose.Precautions}
                                Benefits={pose.Benefits}
                                PoseId={index}
                                onClick={() => setSelectedCard(pose.PoseName)} // Add onClick to set selected card
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
