import { useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import * as Ably from 'ably'
import Tiptap, { TiptapMethods } from '@/components/Tiptap'
import Image from 'next/image'

const ArticlesGeneratePage = () => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [image, setImage] = useState<string>('')

    const { isLoaded, isSignedIn, user } = useUser()

    const contentWrapper = useRef<HTMLDivElement>(null)
    const tiptap = useRef<TiptapMethods>(null)
    const titleField = useRef<HTMLInputElement>(null)
    const descriptionField = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const realtime = new Ably.Realtime({
            key: process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_KEY,
        })

        realtime.connection.on('connected', () => {
            if (isLoaded && isSignedIn) {
                const channel = realtime.channels.get(user.id)
                channel.subscribe((message) => {
                    switch (message.name) {
                        case 'partialResponse':
                            setContent(message.data)

                            setTimeout(() => {
                                if (contentWrapper.current) {
                                    contentWrapper.current.scrollTop = contentWrapper.current.scrollHeight
                                }
                            }, 100)
                            break
                        case 'image':
                            console.log(message.data)
                            setImage(message.data)
                            break
                    }
                })
            }
        })

        return () => {
            realtime.close()
        }
    }, [isLoaded, isSignedIn, user])

    useEffect(() => {
        if (tiptap.current) {
            tiptap.current.addContent(content)
        }
    }, [content])

    const createArticle = () => {
        if (isLoaded && isSignedIn) {
            fetch('/api/articles', {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    description: description,
                    userId: user.id,
                }),
            })
        }
    }

    const clearPrompts = () => {
        if (titleField.current) {
            setTitle('')
            titleField.current.value = ''
        }

        if (descriptionField.current) {
            setDescription('')
            descriptionField.current.value = ''
        }
    }

    return (
        <>
            <div className="flex h-[83vh]">
                <div className="flex flex-col max-w-[50%] h-full w-full mr-8">
                    <h1 className="mb-1 text-2xl font-medium">Generate a new Article</h1>
                    <p className="text-sm opacity-70">
                        Fill out the form below and bloog will handle the rest to generate your new Article.
                    </p>

                    <div className="flex flex-col">
                        <label
                            htmlFor="title"
                            className="pl-2 mt-4 mb-1 text-sm opacity-70">
                            Title
                        </label>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            ref={titleField}
                            id="title"
                            type="text"
                            name="title"
                            maxLength={50}
                            placeholder="The Ultimate AI Blog Post Generator Comparison"
                            className="px-4 py-2 rounded-md shadow-soft focus:outline-none focus:ring focus:ring-black focus:ring-opacity-10"
                        />
                    </div>

                    <div className="flex flex-col h-full">
                        <label
                            htmlFor="description"
                            className="pl-2 mt-2 mb-1 text-sm opacity-70">
                            Description ({description.length}/1.000)
                        </label>
                        <textarea
                            maxLength={1000}
                            onChange={(e) => setDescription(e.target.value)}
                            ref={descriptionField}
                            id="description"
                            name="description"
                            placeholder="I would like my blog post to compare the current solutions on the market of Blog Post AI Tools. Please make sure to take a neutral perspective and mention bloog as the last option."
                            className="h-full px-4 py-2 rounded-md resize-none shadow-soft focus:outline-none focus:ring focus:ring-black focus:ring-opacity-10"></textarea>
                    </div>

                    <div className="flex items-center mt-6">
                        <button
                            onClick={clearPrompts}
                            className="flex items-center justify-center w-1/2 px-3 py-1 mr-4 text-sm transition-all rounded-md active:scale-95 hover:bg-white opacity-80 hover:opacity-100 shadow-soft">
                            <svg
                                className="mr-2"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7 15.25L4.75 13L11.2929 6.45711C11.6834 6.06658 12.3166 6.06658 12.7071 6.45711L15.5429 9.29289C15.9334 9.68342 15.9334 10.3166 15.5429 10.7071L11 15.25H7Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                                <path
                                    d="M12.75 19.25H19.25"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                            </svg>
                            Clear
                        </button>

                        <button
                            onClick={createArticle}
                            className="flex items-center justify-center w-1/2 px-3 py-1 text-sm transition-all bg-white rounded-md whitespace-nowrap active:scale-95 opacity-80 hover:opacity-100 shadow-soft">
                            <svg
                                className="mr-2"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15 12.25H18C18.6904 12.25 19.25 11.6904 19.25 11C19.25 10.3097 18.6904 9.75001 18 9.75001H12.25V6.897C12.25 6.02647 11.7582 5.23065 10.9795 4.84133C10.4428 4.57295 9.79526 4.99931 9.77107 5.59894C9.70508 7.23477 9.27444 9.75001 7.25 9.75001L7.25 17.5747C7.25 18.0704 7.61312 18.4913 8.10345 18.5639L12.004 19.1418C13.1035 19.3047 14.1249 18.5399 14.2781 17.439L15 12.25ZM15 12.25H13.75"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                                <path
                                    d="M4.75 9.75C4.75 9.19772 5.19772 8.75 5.75 8.75H6.25C6.80228 8.75 7.25 9.19772 7.25 9.75V18.25C7.25 18.8023 6.80228 19.25 6.25 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V9.75Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"></path>
                            </svg>
                            Start
                        </button>
                    </div>
                </div>

                <div className="w-full h-full p-6 font-mono text-sm bg-white rounded-md shadow-soft">
                    <div
                        className="h-[98%] overflow-y-scroll"
                        ref={contentWrapper}>
                        {image ? (
                            <Image
                                src={image}
                                alt="test"
                                width={500}
                                height={200}
                                className="object-cover w-full mb-6 rounded-md h-36"
                            />
                        ) : (
                            ''
                        )}

                        <Tiptap
                            ref={tiptap}
                            content={content}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ArticlesGeneratePage
