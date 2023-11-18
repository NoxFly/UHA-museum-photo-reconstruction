# UHA Museum

University project with photo reconstruction use.

Goal : create a gallery of 3D models with things we can find on our campus.

## Run

```sh
npm i # install dependencies
npm run start # run project
# open http://localhost:3000
```

Uses NodeJS >= 18, Express, EJS, Three.JS.


## About

First goal : create a virtual 3D museum of entities present in the campus of the UHA.

### Design

We first thought of a FPS-like environnement where, as a character, we could move and look around ourselves, with the virtual campus, where elements at their real location.

This would be the best idea, but the factor time told us to change our design strategy. When then decided to opt for a basic gallery system, similar to the [Three.js examples](https://threejs.org/examples/) section.

### Web technology

For the choice of the web technology, we immediatly though about NodeJS with Express, as it is the most simple and efficient way (for us) to create web server, due to our past experience with this language and some others.

### Model storage strategy

We would have liked to store the 3D models, a description, and a thumbnail for each of those. And maybe, have a structure to let it scale, if a day we wanted to add something extra.

We first thought of doing a dynamic storage system, where the node program searches all 3D models in a folder, and for each model present, it would says that it has to show it. But this was not a good idea if we had to scale, as said before. The database solution would be too much for this little project, and also too much setup for those who wanted to test this project. So we finally decided to use a json system, where all models we want to show are in the `data/models/models.json` file.

One thing we seen after the development and that we didn't think before, is that each models have not the same size neither the same need of light.<br>
Without lights, the models would be entirely black.

So we decided to add an array of lights specifically to each model in the json.

A model in the json file looks like this :

```json
{
        "name": "Model Name",
        "description": "Lorem ipsum dolor sit amet", // Can be a long text
        "id": "modelId", // This is for file names (model & thumbnail)
        "lights": [
            [[3, 10, 3], 10], // Position [x,y,z], intensity. Can be floats
            [[6, 10, 0], 20],
            [[0, 5, 6], 10]
        ]
    },
```

### Creation of models

We splitted team of students in 3 roles :
- The photographers
- The model reconstructors
- The web developers / model integrators

First, the photographers had to take a series of photos for a maximum number of entities on the campus. The average count of photos is around 20 for little entities, 70 for biggers.

Then, this team sends the photos to the model reconstructors team, which use the following softwares / pipeline to reconstruct the entities in 3D :
- Visual SFM, which uses all the photos to find / guess the 3D coordinates of each pixels, trying to achieve a shape.
- MeshLab, to transform the entity from cloud points to meshes, keeping the colors. The poisson algorithm has been used.
- Blender, to translate, rotate and rescale the entity at the origin of the graph, to be in the right direction of the camera. Some vertices are also removed from the object, as they are "floating" in the space. The colors are not shown in Blender, but are still present. Blender has also been used to transform the `.ply` file made by Visual SFM to a `.glb` file. More information below.
Afterwards, they send these models to the web developers / model integrators team.

Finally, the last team receives the cleaned 3D model, a picture of it, and integrate it in the website, with the right colors. The same team developed upstream the website to welcome models when received.

### PLY, GLB and GLTF

PLY are files created by Visual SFM. This file stores the vertices, colors, textures and normals of the models, making it useful for certains cases, but heavier. The disadventages with this type of file is, that it is not supported everywhere, or not fully supported. For example, Blender shows a "experimental" warning when using this type of file. MeshLab handles these files correctly. Another point is, that ThreeJS is not optimized for ply files, so, loading a model takes severals seconds, and sometimes minutes, if hundred of thousands of vertices are used. This format is often really heavier than GLB format.

GLB files are what internet shows us as the best type of file, supported by ThreeJS, loaded in < 1s for every models, no matter the weight, keeping vertices, colors, textures and normals. Problem is, MeshLab crashes when opening a glb file. So we had to convert the PLY to GLB after the MeshLab step. GLB is a binary file. Some websites online can convert PLY to GLB, but be sure to not use any compression of any level, as ThreeJS and Blender will not support it after that.

GLTF files are similar to GLB ones, but in a JSON format, making it more readable for humans, but more heavier. The difference is that GLTF only stores vertices. The colors, textures and normals are in separated files, making it more modular, but not needed in our cases.

On the website we developped, we are loading all the models once, so we can swap as much as we want between models, without loading. The loading time is at a maximum of 1s in local. When we used PLY at the beginning, we were at around 5s for 1 little model, sometimes 30s for bigger, and 1 minute for the biggest.

# Licence

This project is under the [MIT licence](./LICENCE).

You can reuse the sources, the 3D models and the images, but we have to be quoted (except for all that is under the `src/public/asset` folder).