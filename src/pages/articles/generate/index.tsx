import { useState } from 'react'

const ArticlesGeneratePage = () => {
    const [description, setDescription] = useState<string>('')

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
                            Description ({description.length}/500)
                        </label>
                        <textarea
                            maxLength={500}
                            onChange={(e) => setDescription(e.target.value)}
                            id="description"
                            name="description"
                            placeholder="I would like my blog post to compare the current solutions on the market of Blog Post AI Tools. Please make sure to take a neutral perspective and mention bloog as the last option."
                            className="h-full px-4 py-2 rounded-md resize-none shadow-soft focus:outline-none focus:ring focus:ring-black focus:ring-opacity-10"></textarea>
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
