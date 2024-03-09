import React, { useState , useEffect } from 'react';
import bot from "../assets/bot.png";
import user from "../assets/user.png";
import axios from 'axios';
import { client } from "@gradio/client";

interface Message {
    message: string;
    sender: string;
}

function Chat() {
    const botStyle = "bg-[white] p-4 w-fit flex flex-row gap-8 justify-start items-center rounded-[15px]";
    const userStyle = "bg-[white] p-4 w-fit flex flex-row gap-8 justify-end items-center rounded-[15px] ml-auto";
    const textStyle = "font-mont text-[20px]";
    const imgStyle = "h-[60px]";
    const buttonStyle = "bg-[#fff] border border-[#C5BAA9] rounded-[40px] font-mont text-[16px] p-4 hover:bg-[#C5BAA9]";
    const selectedButtonStyle = "bg-[#C5BAA9] border border-[#C5BAA9] rounded-[40px] font-mont text-[16px] p-4";

    const [selectedOccasion, setSelectedOccasion] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null); // New state variable for selected color
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [showColor, setShowColor] = useState(false);
    const [colorButtonsDisabled, setColorButtonsDisabled] = useState(false);
    const [selectionButtonsDisabled, setSelectionButtonsDisabled] = useState(false);
    const [selectionType, setSelectionType] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [fetchedFile, setFetchedFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [showUploadOption, setShowUploadOption] = useState(false);
    const [disableVirtual, setDisableVirtual] = useState(false);
    const [showFinalImagePath, setShowFinalImage] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [chatMessages, setChatMessages] = useState<
        Array<{ message: string; sender: string }>
    >([]);
    const [disableChat, setDisableChat] = useState(true);
    const [responseReceived, setResponseReceived] = useState(false);
    const [items, setItems] = useState<string[]>([]);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [showOcassioUploadOption, setShowOcassionUploadOption] = useState(false);
    const [showOcassionFinalImagePath, setshowOcassionFinalImagePath] = useState(false);
    const [anyImageClicked, setAnyImageClicked] = useState(false);
    const [ocassionDisableChat, setOcassionDisableChat] = useState(true);


    useEffect(() => {
        setChatMessages([{ message: "I am your chatBot, ask your queries to me, I will help you in fashion", sender: "bot" }]);
    }, []);
    
    const occasions = [
        "Religious Occasions",
        "Cultural Festivals",
        "Personal Celebrations",
        "National Holidays",
        "Seasonal Occasions",
        "Ceremonial Events",
        "Civic and Community Events",
        "Civic and Political Events",
        "Educational Events",
        "Sports Events",
        "Business and Corporate Events",
        "Special Commemorations"
    ];

    const colors = [
        "Black", "White", "Blue", "Brown", "Grey", "Green", "Pink", "Maroon"
    ];

    const handleButtonClick = (occasion : any) => {
        setSelectedOccasion(occasion);
        setShowColor(true); 
        setButtonsDisabled(true);
    };

    async function handleColorClick(color : any) {
    // Disable color buttons and set the selected color
    // This part is just an example. You'll need to implement the actual UI logic.
    setColorButtonsDisabled(true);
    setSelectedColor(color);

    // Prepare the data to send in the request
    const data = {
        color: color,
        selectedOccasion: selectedOccasion
    };

    try {
        // Make the POST request to the Flask application
        const response = await fetch('http://localhost:5000/handleocassion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const result = await response.json();

        // Process the result
        console.log(result);
        const newItems = result.newItems;
        console.log(newItems);

        // Update the UI with the new items and show recommendations
        // This part is just an example. You'll need to implement the actual UI logic.
        setItems(prevItems => [...prevItems, ...newItems]);
        setShowRecommendations(true);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

    const handleSelectionTypeClick = (type :any) => {
        setSelectionType(type);
        setSelectionButtonsDisabled(true);
    };

    // async function query(data : any) {
    //     console.log("request");
    //     const response = await axios({
    //         url: "https://api-inference.huggingface.co/models/NouRed/sd-fashion-products",
    //         method: "post",
    //         headers: { Authorization: "Bearer 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" },
    //         data: JSON.stringify(data),
    //         responseType: 'blob', // Specify that the response should be treated as a Blob
    //     });
    //     console.log("response");
    //     return response.data; // Return the Blob
    // }
    

    const handlePromptClick = (prompt : any) => {
        setSelectedPrompt(prompt);
        setInputDisabled(true);
    
        const sendPromptToFlask = async (prompt : any) => {
            try {
                const response = await fetch('http://127.0.0.1:5000/handleprompt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt }),
                });
                console.log("response",response)
                setResponseReceived(true); 
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        sendPromptToFlask(prompt);
    };

    const handleImageUpload = (e : any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setUploadedFile(file); // Store the file in the state
                setShowUploadOption(false); // Hide the upload option after uploading
    
                // Create a FormData object to hold the files
                const formData = new FormData();
                formData.append('uploadedFile', file);
                // Send the files to the Flask server
                
                const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Assuming the response contains the file path as a string
                setShowFinalImage(true); // Update the state with the file path
                console.log(response.data.message);// Update the state with the file path
                console.log('Files uploaded successfully:', response.data.result);
                console.log("kdsjgbk")
                setDisableChat(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    
    const handleOcassionImageUpload = (e : any) => {
        const file = e.target.files[0];
        console.log(selectedImageUrl)
        setUploadedFile(file); // Store the file in the state
        setShowOcassionUploadOption(false); 
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setUploadedFile(file); // Store the file in the state
                setShowOcassionUploadOption(false); // Hide the upload option after uploading
    
                // Create a FormData object to hold the files
                const formData = new FormData();
                formData.append('uploadedFile', file);
                formData.append('url', selectedImageUrl);
                // Send the files to the Flask server
                
                const response = await axios.post('http://127.0.0.1:5000/uploadocassion', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Assuming the response contains the file path as a string
                setshowOcassionFinalImagePath(true); // Update the state with the file path
                console.log(response.data.message);// Update the state with the file path
                console.log('Files uploaded successfully:', response.data.result);
                console.log("kdsjgbk")
                setOcassionDisableChat(false);
                setDisableChat(false);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const sendMessage = async () => {
        try {
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { message: userInput, sender: "user" },
          ]);
    
          setUserInput("");
    
          
          const response = await axios.post("http://127.0.0.1:5000/predict", {
            text: userInput,
          });
          console.log(response);
          const botMessage = response.data.result;
    
          setChatMessages((prevMessages) => [
            ...prevMessages,
            { message: botMessage, sender: "bot" },
          ]);
    
          console.log(botMessage);
    
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };

    const handleImageClick = (url : any) => {
        setSelectedImageUrl(url);
        setShowOcassionUploadOption(true);
        console.log(url);
        setAnyImageClicked(true);
    };
    

    return (
        <div className="w-[80%] bg-inherit flex flex-col">
            <div className="h-[85%] pt-10 pr-10 pl-10 flex flex-col gap-5 overflow-y-scroll">
                <div className={botStyle}>
                    <img src={bot} className={imgStyle} />
                    <span className={textStyle}>
                        Hello there, welcome to stylist.AI. I am here to help you with your fashion queries. Let's get started.
                    </span>
                </div>
                
                <div className={botStyle}>
                    <img src={bot} className={imgStyle} />
                    <div className='flex flex-col gap-5'>
                        <span className={textStyle}>
                            Please select the type of selection you need help with.
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className={selectionType === "Based on Occasion" ? selectedButtonStyle : buttonStyle}
                                onClick={() => handleSelectionTypeClick("Based on Occasion")}
                                disabled={selectionButtonsDisabled}
                            >
                                Based on Occasion
                            </button>
                            <button
                                className={selectionType === "Based on Prompt" ? selectedButtonStyle : buttonStyle}
                                onClick={() => handleSelectionTypeClick("Based on Prompt")}
                                disabled={selectionButtonsDisabled}
                            >
                                Based on Prompt
                            </button>
                        </div>
                    </div>
                </div>
                {selectionType && (
                    <div className={userStyle}>
                        <span className={textStyle}>
                            {selectionType}
                        </span>
                        <img src={user} className={imgStyle} />
                    </div>
                )}
                {selectionType === "Based on Prompt" && (
                    <div className={userStyle}>
                        <input
                            className="w-[80%] p-5 rounded-tl-[10px] rounded-bl-[10px] font-mont text-[20px]"
                            placeholder="Enter your prompt here"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handlePromptClick((e.target as HTMLInputElement).value);
                                }
                            }}
                            disabled={inputDisabled}
                        />
                        <img src={user} className={imgStyle} />
                    </div>
                )}

                {responseReceived && (
                    <div className='flex flex-col gap-5'>
                        <div className={botStyle}>
                            <img src={bot} className={imgStyle} />
                            <img src='image.JPEG' className='h-[500px]' />
                        </div>
                        <div>
                        <button 
                            className={disableVirtual ? 'bg-none rounded-[20px] font-mont border bg-[#C5BAA9] p-4 ml-[250px]' : 'bg-none rounded-[20px] font-mont border border-[#C5BAA9] p-4 ml-[250px] hover:bg-[#C5BAA9]'}
                            onClick={() => {
                                setShowUploadOption(!showUploadOption);
                                setDisableVirtual(true);
                            }}
                        >
                            Virtual Try On
                        </button>
                        </div>
                    </div>
                )}

                {showUploadOption && (
                    <div className={userStyle}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e)}
                        />
                        <img src={user} className={imgStyle} />
                    </div>
                )}

                {uploadedFile && responseReceived && (
                    <div className={userStyle}>
                        <img src={URL.createObjectURL(uploadedFile)} className='h-[500px]'/>
                        <img src={user} className={imgStyle} />
                    </div>
                )}

                {showFinalImagePath && (
                    <div className={botStyle}>
                        <img src={bot} className={imgStyle} />
                        <img src='/finalimg.png' className='h-[500px]' />
                    </div>
                )}

                {!disableChat && showFinalImagePath && (
                    <>
                        {chatMessages.map(({ message, sender }, index) => (
                            <div key={index} className={sender === "bot" ? botStyle : userStyle}>
                                {sender === "bot" ? (
                                    <>
                                        <img src={bot} className={imgStyle} alt="Bot" />
                                        <span className={textStyle}>{message}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className={textStyle}>{message}</span>
                                        <img src={user} className={imgStyle} alt="User" />
                                    </>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {selectionType === "Based on Occasion" && (
                    <>
                        <div className={botStyle}>
                            <img src={bot} className={imgStyle} />
                            <span className={textStyle}>
                                Please select the occasion you need help with.
                            </span>
                        </div>
                        <div className={botStyle}>
                            <img src={bot} className={imgStyle} />
                            <div className="grid grid-cols-4 gap-4">
                                {occasions.map((occasion, index) => (
                                    <button
                                        key={index}
                                        className={selectedOccasion === occasion ? selectedButtonStyle : buttonStyle}
                                        onClick={() => handleButtonClick(occasion)}
                                        disabled={buttonsDisabled}
                                    >
                                        {occasion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {selectedOccasion && (
                    <div className={userStyle}>
                        <span className={textStyle}>
                            {selectedOccasion}
                        </span>
                        <img src={user} className={imgStyle} />
                    </div>
                )}
                {showColor && (
                    <>
                        <div className={botStyle}>
                            <img src={bot} className={imgStyle} />
                            <span className={textStyle}>
                                Please select the color you need help with.
                            </span>
                        </div>
                        <div className={botStyle}>
                            <img src={bot} className={imgStyle} />
                            <div className="grid grid-cols-4 gap-4">
                                {colors.map((color, index) => (
                                    <button
                                        key={index}
                                        className={selectedColor === color ? selectedButtonStyle : buttonStyle}
                                        onClick={() => handleColorClick(color)}
                                        disabled={colorButtonsDisabled}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {selectedColor && (
                    <div className={userStyle}>
                        <span className={textStyle}>
                            {selectedColor}
                        </span>
                        <img src={user} className={imgStyle} />
                    </div>
                )}
                {showRecommendations && (
                    <>
                    <div className={botStyle}>
                        <img src={bot} className={imgStyle} />
                        <div className='flex flex-col items-center gap-5'>
                            <span className={textStyle}>
                                Please select any of these for virtual try on.
                            </span>
                            <div className='flex flex-row gap-5'>
                            {items.map((url, index) => (
                                <img
                                key={index}
                                src={url}
                                className={`h-[300px] cursor-pointer ${anyImageClicked && url !== selectedImageUrl ? 'opacity-50' : ''}`}
                                alt={`Image ${index + 1}`}
                                onClick={() => {
                                    if (!anyImageClicked) {
                                    handleImageClick(url);
                                    }
                                }}
                                />
                            ))}
                            </div>
                        </div>
                    </div>
                    </>
                )}

                {(showOcassioUploadOption && 
                    <div className={userStyle}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOcassionImageUpload(e)}
                        />
                        <img src={user} className={imgStyle} />
                    </div>
                )}

                {uploadedFile && showRecommendations && (
                    <div className={userStyle}>
                        <img src={URL.createObjectURL(uploadedFile)} className='h-[500px]'/>
                        <img src={user} className={imgStyle} />
                    </div>
                )}
                {showOcassionFinalImagePath && (
                    <div className={botStyle}>
                        <img src={bot} className={imgStyle} />
                        <img src='/finalimg.png' className='h-[500px]' />
                    </div>
                )}
                {!ocassionDisableChat && !disableChat &&(
                    <>
                        {chatMessages.map(({ message, sender }, index) => (
                            <div key={index} className={sender === "bot" ? botStyle : userStyle}>
                                {sender === "bot" ? (
                                    <>
                                        <img src={bot} className={imgStyle} alt="Bot" />
                                        <span className={textStyle}>{message}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className={textStyle}>{message}</span>
                                        <img src={user} className={imgStyle} alt="User" />
                                    </>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="h-[15%] pl-[50px] flex flex-row justify-center items-center gap-0">
                <input
                    className="w-[80%] p-5 rounded-tl-[10px] rounded-bl-[10px] font-mont text-[20px]"
                    placeholder="Query our doubts to our AI"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                    disabled={disableChat}
                />
                <button
                    className={`w-[10%] h-[70px] flex justify-center items-center rounded-tr-[10px] rounded-br-[10px] ${disableChat ? 'bg-[#f0e8dd]' : 'bg-[#C5BAA9]'}`}
                    disabled={disableChat}
                >
                    <img src="send.png" style={{ opacity: disableChat ? 0.5 : 1 }} />
                </button>


            </div>
        </div>
    );
}

export default Chat;
