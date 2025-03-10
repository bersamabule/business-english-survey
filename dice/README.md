# Interactive Die for PowerPoint

This is an interactive 3D die that can be embedded in PowerPoint presentations. When clicked, it will randomly roll and display one of the six faces.

## How to Embed in PowerPoint

1. **Open PowerPoint** and navigate to the slide where you want to add the die.

2. **Go to Insert > Web Object**:
   - In newer versions: Insert tab > Web > Online Video/Web Viewer
   - In older versions: Insert tab > Object > Create from File > Browse (select the HTML file)
   - Alternative method: Insert tab > Get Add-ins > Store > search for "Web Viewer"

3. **Add the die**:
   - If using Web Viewer: Enter the path to the index.html file (e.g., file:///C:/Users/username/path/to/dice/index.html)
   - If using Object: Browse to and select the index.html file

4. **Adjust size** as needed on your slide.

5. **Test the functionality** by entering presentation mode and clicking on the die.

## Troubleshooting

- If the die doesn't appear, make sure all three files (index.html, styles.css, and script.js) are in the same folder.
- If the die doesn't roll when clicked in presentation mode, try using the Web Viewer add-in which has better support for interactive content.
- For best results, keep the files in a fixed location that won't change when sharing the PowerPoint.

## Alternative Method (If Web Object Doesn't Work)

1. Open the die in a web browser
2. Take a screenshot of each die face
3. Create a PowerPoint macro that randomly displays one of the six images when clicked

## Files Included

- `index.html` - The main HTML file
- `styles.css` - CSS styling for the 3D die
- `script.js` - JavaScript for die rolling functionality
