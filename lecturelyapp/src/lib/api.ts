export const generateSubtitles = async (
  url: string,
  targetLang: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-from-url?url=${encodeURIComponent(url)}&target_lang=${targetLang}`,
    {
      method: "POST",
    }
  )

  if (!response.ok) {
    throw new Error("Backend failed")
  }

  return response.json()
}