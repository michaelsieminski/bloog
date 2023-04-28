import { useState } from 'react'
import Link from 'next/link'

const ArticlesGeneratePage = () => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const createArticle = () => {
        fetch('/api/articles', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                description: description,
            }),
        })
    }

    return (
        <>
            <div className="flex h-[88vh]">
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
                            id="description"
                            name="description"
                            placeholder="I would like my blog post to compare the current solutions on the market of Blog Post AI Tools. Please make sure to take a neutral perspective and mention bloog as the last option."
                            className="h-full px-4 py-2 rounded-md resize-none shadow-soft focus:outline-none focus:ring focus:ring-black focus:ring-opacity-10"></textarea>
                    </div>

                    <div className="flex items-center mt-6">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-1/2 px-3 py-1 mr-4 text-sm transition-all rounded-md active:scale-95 hover:bg-white opacity-80 hover:opacity-100 shadow-soft">
                            Cancel
                        </Link>

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
                                    d="M5.04509 16.705L16.707 5.04302C17.0976 4.65249 17.7307 4.65249 18.1213 5.04301L18.957 5.8788C19.3476 6.26933 19.3476 6.90249 18.957 7.29302L7.29509 18.955C6.90457 19.3455 6.2714 19.3455 5.88088 18.955L5.04509 18.1192C4.65457 17.7287 4.65457 17.0955 5.04509 16.705Z"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                <path
                                    d="M15 7L17 9"
                                    stroke="currentColor"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                            </svg>
                            Create Article
                        </button>
                    </div>
                </div>

                <div className="w-full h-full p-6 font-mono text-sm bg-white rounded-md shadow-soft">
                    <p>result will be here</p>
                </div>
            </div>
        </>
    )
}

export default ArticlesGeneratePage
