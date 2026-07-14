# 🖋️ Same Style Select Plugin

Designing is a process. A design concept undergoes multiple attempts of visualization and revisions before it gets finalized. Due to this phenomena, it is not unusual that the design workspace gets flooded with unused/to be revised text layers. 

Same Text Style Select Plugin lets designers mass select texts across the design files based on specific typographic properties. This tool is helpful for managing and organizing legacy design files, and files with inconsistent text styles.

The concept for this plugin was initially for shape elements, and I called it as Same Shape Select. The idea that sparked this development is I want to create a plugin tool that can mass select shape elements when designing patterns. During the planning stage, I listed the properties that can be extracted from shapes. As I was creating the checklist that I'm about to follow throughout the development, I noticed that shape layers can be too delicate, and can possess a lot of properties ranging from height, width, color (that can be solid/ gradient), border, border radius, fill, and etc. This project being my first plugin tool, I quickly reassessed the scope of the project I am about to do, and turned my attention to text elements instead. But who knows? I may do it soon. 

## 🗃️ Built with
- HTML/CSS
- JS
- TypeScript

## 🗒️ Steps to Use:

1. Upon the launch of the plugin, select a text layer. This text layer will be the point of reference in selecting other text layers. The plugin extracts the typographic properties and lists them.
2. The corresponding checkbox of text properties represents the inclusion during search and selection. Must click at least one item to trigger the search.
3. Click "Select Now". The plugin then selects the text objects with properties matching with the source text layer.

If no matches were found, try unchecking one property to broaded search. Once the target text layers are selected, users may perform keyboard shorcut commands like grouping ( Ctrl + G), deletion (Del key), duplicate (Ctrl + D), and many more. 

## 🎞️ Video


 


