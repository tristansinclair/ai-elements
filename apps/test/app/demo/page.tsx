"use client";

import { Conversation, ConversationContent, ConversationScrollButton } from "@repo/elements/src/conversation";
import { Message, MessageContent } from "@repo/elements/src/message";
import { nanoid } from "nanoid";


const messages: {
    key: string;
    from: "user" | "assistant";
    content: string;
}[] = [
        {
            key: nanoid(),
            from: "user",
            content: "Hello, how are you?",
        },
        {
            key: nanoid(),
            from: "assistant",
            content: "Hey! How can I help you today?"
        },
        {
            key: nanoid(),
            from: "user",
            content: "I'm looking for a restaurant in the city"
        },
        {
            key: nanoid(),
            from: "assistant",
            content: "I'm sorry, I can't help you with that"
        }

    ];


const TaskPage = () => {


    return (
        <div className="flex h-screen flex-col bg-background max-w-3xl mx-auto border">
            <Conversation className="flex-1">
                <ConversationContent>
                    {messages.map(({ content, ...message }) => (
                        <Message from={message.from} key={message.key}>
                            <MessageContent>{content}</MessageContent>
                        </Message>
                    ))}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>
        </div>
    );
};

export default TaskPage;


