function SideNav(){
    return(
        <div className="bg-[#C5BAA9] w-[20%] h-[100vh] rounded-br-[40px] rounded-tr-[40px] flex flex-col justify-between items-center pt-7 pb-7">
            <div className="flex flex-row gap-5">
                <img src="logo.png" />
                <span className="text-[32px] font-normal text-[#000] font-mont">
                    stylist.AI
                </span>             
            </div>
            <div className="flex w-[90%] flex-col justify-center items-center gap-3 bg-[#fff] rounded-[30px] pt-4 pb-4">
                <span className="font-mont text-[32px]">
                    Your Past Chats
                </span>
                <div className="flex flex-col gap-3 mt-[10px]">
                    <span className="font-mont text-[20px]">
                        Combination for black shirt
                    </span>
                    <hr className="bg-[#AEAEAE]"/>
                    <span className="font-mont text-[20px]">
                        Combination for black shirt
                    </span>
                    <hr className="bg-[#AEAEAE]"/>
                    <span className="font-mont text-[20px]">
                        Combination for black shirt
                    </span>
                    <hr className="bg-[#AEAEAE]"/>
                    <span className="font-mont text-[20px]">
                        Combination for black shirt
                    </span>
                </div>
            </div>
            <div className="flex flex-row w-[90%] justify-center items-center gap-4 bg-[#ffff] rounded-[30px]">
                <span className="text-[64px] mt-[-10px]">
                    +
                </span>
                <span className="text-[36px]">
                    New Chat
                </span>
            </div>
        </div>
    );
}

export default SideNav;