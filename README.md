mediacenterjs-plugin-generator
================================

Generator script to stream line creation of MediacenterJS plugins.


##How to use:

Install the mediacenterjs-plugin-generator **globally**
```
npm install mediacenterjs-plugin-generator -g

```

Since the plugin generator is installed globally you can now navigate to an empty directory in you terminal window and run `mediacenterjs-plugin-generator` then answer a few questions.

```
mediacenterjs-plugin-generator
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