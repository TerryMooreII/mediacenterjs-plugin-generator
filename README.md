mediacenterjs-plugin-generator
================================

Generator script to stream line creation of MediacenterJS plugins.


##How to use:

```
git clone https://github.com/TerryMooreII/mediacenterjs-plugin-generator.git
cd mediacenter-plugin-generator
npm install
node plugin-generator.js
```

This will download the plugin template generator and then kick off the script. All you have to do is answer a few questions.

```
node plugin-generator.js 
prompt: Plugin Name (Letters and Dashes only):  Awesome Plugin Name
prompt: Short description of the plugin.:  This plugin is going to do awesome things
prompt: Author:  Terry Moore
prompt: Keywords (comma seperated):  audio, podcast
prompt: Plugins GitHub repo homepage (optional):  http://github.com/TerryMooreII/mediacenterjs-awesome-plugin-name
Sit back and relex while we create your plug-in's skeleton...
Plug-in created successfully.
Go forth and create something cool!
```

Your plugin is now in the `mediacenterjs-<your-plugin-name>` directory.

Note: We will automatically append the `mediacenterjs-` to your plugin name. This is so that MediacenterJS's plugin manager will find your plugin once you have submitted it to the node NPM repository.

You can also read the mediacenterjs plugin INSTRUCTION.md file located in your new plugin home folder.