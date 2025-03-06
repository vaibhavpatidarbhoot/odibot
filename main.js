
    const chatContent = document.getElementById("chat-content");
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");

    const chatGPTLogo = "https://i.ibb.co/0Rp3Qfw3/bhoot.png";
    const userLogo = "https://i.ibb.co/ssQNvBC/67373290.jpg";

    function parseMarkdown(text) {
        text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        text = text.replace(/\n/g, '<br/>');
        return text;
    }

    function createMessageElement(message, fromUser, isLoading = false) {
        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add("message", fromUser ? "user" : "bot");

        const avatar = document.createElement("img");
        avatar.src = fromUser ? userLogo : chatGPTLogo;
        avatar.alt = fromUser ? "User" : "OdiBot";
        avatar.classList.add("avatar");

        const bubble = document.createElement("div");
        if (isLoading) {
            bubble.classList.add("loading");
            bubble.innerHTML = `<div class="dots">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>`;
        } else {
            bubble.classList.add("bubble");
            bubble.innerHTML = parseMarkdown(message);
        }

        messageWrapper.appendChild(fromUser ? bubble : avatar);
        messageWrapper.appendChild(fromUser ? avatar : bubble);

        return messageWrapper;
    }

    function getCustomResponse(userMessage) {
        const messageLower = userMessage.toLowerCase().trim();

        const ownerKeywords = [
            "who is your owner", "who owns you", "who is owner of odibot", "who owns odibot", 
            "who is your creator", "who made you", "who built you", "who developed you",
            "who runs odibot", "who operates odibot", "who controls odibot",
            "owner of you", "your owner", "who is the owner", "who created you", "owner of odibot","who is odibot owner", "who owns odibot", "odibot owner", 
        ];

        if (ownerKeywords.some(keyword => messageLower.includes(keyword))) {
            return "**OdiVex** is my owner. Who was founded by Vaibhav Bhoot. Contact him on Telegram: @vaibhavbhoot or @officialbhoot.";
        }

        const websiteKeywords = {
            "odivex": "OdiVex is an amazing project created by Vaibhav Bhoot. Check out OdiVex.com!",
            "odivex.com": "OdiVex.com is owned by Vaibhav Bhoot. Contact: @vaibhavbhoot or @officialbhoot on Telegram.",
            "sjr.lol": "SJR.lol is owned by Vaibhav Bhoot. Reach out via Telegram: @vaibhavbhoot or @officialbhoot.",
            "ind.lol": "IND.lol is a domain owned by Vaibhav Bhoot. Telegram: @vaibhavbhoot, @officialbhoot.",
            "devill.store": "DeVill.store is managed by Vaibhav Bhoot. Connect on Telegram: @vaibhavbhoot, @officialbhoot.",
            "hueduniverse.life": "HuedUniverse.life is owned by Vaibhav Bhoot. Telegram: @vaibhavbhoot, @officialbhoot.",
            "techhacksai.site": "TechHacksAI.site is part of Vaibhav Bhoot's projects. Telegram: @vaibhavbhoot, @officialbhoot.",
            "growwin.site": "GrowWin.site is owned by Vaibhav Bhoot. Contact: @vaibhavbhoot, @officialbhoot."
        };

        for (const key in websiteKeywords) {
            if (messageLower.includes(key)) {
                return websiteKeywords[key];
            }
        }

        if (messageLower.includes("what is your name") || messageLower.includes("who are you")) {
            return "I am **OdiBot**, powered by OdiVex!";
        }

        return null;
    }

    async function fetchResponse(userMessage) {
        const customResponse = getCustomResponse(userMessage);
        if (customResponse) {
            return customResponse;
        }

        try {
            const response = await fetch("https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6YW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ==", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: userMessage
                })
            });

            if (!response.ok) {
                console.error("Error:", response.statusText);
                return "There was an error. Please try again later.";
            }

            const data = await response.json();
            return data.status === "success" ? data.text : "There was an error. Please try again later.";
        } catch (error) {
            console.error("Error:", error);
            return "There was an error. Please try again later.";
        }
    }

    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        chatContent.appendChild(createMessageElement(userMessage, true));
        userInput.value = "";

        const loadingMessage = createMessageElement("", false, true);
        chatContent.appendChild(loadingMessage);
        chatContent.scrollTop = chatContent.scrollHeight;

        const botResponse = await fetchResponse(userMessage);

        chatContent.removeChild(loadingMessage);
        chatContent.appendChild(createMessageElement(botResponse, false));
        chatContent.scrollTop = chatContent.scrollHeight;
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            const welcomeMessage = createMessageElement("How can I help you today?", false);
            chatContent.appendChild(welcomeMessage);
            chatContent.scrollTop = chatContent.scrollHeight;
        }, 100);
    });

