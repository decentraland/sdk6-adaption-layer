export function setupUi()
{
    // Create screenspace component
    const canvas = new UICanvas()

    // Create a textShape component, setting the canvas as parent
    const text = new UIText(canvas)
    text.value = "Hello world!"
}