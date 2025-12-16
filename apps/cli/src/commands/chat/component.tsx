import { api } from "@r5dan/backend/convex/_generated/api.js";
import { client as convex } from "@r5dan/backend/index";
import { client } from "../../trpc";
import {
	Text,
	Box,
	useInput,
	useStdout,
} from "ink";
import { useState } from "react";
import type {MyUIMessage} from "../../ai"

export function App() {
	
	const [selectedChat, setSelectedChat] = useState(chats[0]);
	const [text, setText] = useState("");
	const [loc, setLoc] = useState<number | null>(null);

	useInput((input, key) => {
		if (key.upArrow) {
			if (chats.indexOf(selectedChat) === 0) {
				setSelectedChat(chats[chats.length - 1]);
			} else {
				setSelectedChat(chats[chats.indexOf(selectedChat) - 1]);
			}
		} else if (key.downArrow) {
			if (chats.indexOf(selectedChat) === chats.length - 1) {
				setSelectedChat(chats[0]);
			} else {
				setSelectedChat(chats[chats.indexOf(selectedChat) + 1]);
			}
		}	else if (key.backspace || key.delete) {
			console.log(key);
			console.log(loc);

			if (loc !== null) {
				setText(text.slice(0, loc - 1) + text.slice(loc));
				if (text.length === 0) {
					setLoc(null);
				} else {
					setLoc(loc - 1);
				}
			}
		} else if (key.leftArrow) {
			if (loc !== null) {
				setLoc(loc - 1);
			}
		} else if (key.rightArrow) {
			if (loc !== null && text.length - 1 > loc) {
				setLoc(loc + 1);
			} else {
				setLoc(0);
			}
		} else if (key.return) {
			console.log(text);
			setText("");
			setLoc(null);
		} else if (key.shift) {
			setText(text.slice(0, loc) + input.toUpperCase() + text.slice(loc));
			setLoc(loc + 1);
		} else {
			setText(text.slice(0, loc) + input + text.slice(loc));
			setLoc(loc + 1);
		}
	});

  return (
		<Box minHeight={"100%"} minWidth={"100%"}>
			<ChatSelector chats={["test", "test2"]} />
      <Box flexDirection="column">
        <Chat messages={["test", "test2"]} />
				<Input />
			</Box>
		</Box>
	);
}

function Chat({ messages }: { messages: MyUIMessage[] }) {
	return (
		<Box
			flexDirection="column"
			flexGrow={1}
			borderStyle="round"
			borderColor="green"
			paddingX={1}
		>
			<Text color="greenBright">Conversation</Text>
			{messages.map((m, i) => (
				<Box key={i} marginTop={1}>
					<Text>
						<Text color="magenta">
							{m.role === "user" ? "You: " : "AI: "}
						</Text>
						{m.text}
					</Text>
				</Box>
			))}
		</Box>
	);
}


function ChatSelector({ chats, index }: { chats: string[]; index: number }) {
	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor="cyan"
			width={24}
			paddingX={1}
		>
			<Text color="cyanBright">Chats</Text>
			{chats.map((c, i) => (
				<Text key={i} color={i === index ? "green" : undefined}>
					{c}
				</Text>
			))}
		</Box>
	);
}

const InputBar = ({ input }: {input:string}) => (
	<Box borderStyle="round" borderColor="yellow" paddingX={1} marginTop={1}>
		<Text color="yellow">{input || "Type your message..."}</Text>
	</Box>
);