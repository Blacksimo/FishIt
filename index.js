var pesce = [];
var cast, pullup, whistle;
var boat, lighthouse;
var boatFlag = false;
var fishFlag = false;
var flag = false;
var castFlag = false;
var controlFlag = false;
var helper;
var boxes = [];
var movingCubes = [];
var collidableMeshList = [];
var container, stats, info;
var scene, renderer, camera;
var light, light2;
var progress;
var quickTime = false;
var pressSpace = false;
//var endQTEvent = false;
var keyboard = new KeyboardState();
var bar = document.getElementById("bar-1");
var xAxis = new THREE.Vector3(1, 0, 0);
var yAxis = new THREE.Vector3(0, 1, 0);
var zAxis = new THREE.Vector3(0, 0, 1);
var baitBox;
var baited;

// Building the hierarchical structure
var lighthouseId = 0;
var boatId = 1;
var rod1Id = 2;
var rod2Id = 3;
var rod3Id = 4;
var numNodes = 5;
var figure = [];
var m = new THREE.Vector3();
var stack = [];
var theta = [0, 0, 0.5, 0, 0];
for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null); // create a node for each object
var insideWater = false;

///////////////////
//BROWSER DETECTION
///////////////////

function BrowserDetection() {
    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
        console.log("Explorer");
        initSounds("ogg");
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
        // insert conditional Chrome code here
        console.log("Chrome");
        initSounds("ogg");
    }
    //Check if browser is Firefox 
    else if (navigator.userAgent.search("Firefox") >= 0) {
        // insert conditional Firefox Code here
        console.log("Firefox");
        initSounds("ogg");
    }
    //Check if browser is Safari
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        // insert conditional Safari code here
        console.log("Safari");
        initSounds("wav");
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
        // insert conditional Opera code here
        console.log("Opera");
        initSounds("ogg");
    }

    //    #cheating
    else {
        console.log("Safari??");
        initSounds("wav");
    }
}

///////////////////
//HIERARCHY
///////////////////
function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}

function initNodes(Id) {
    switch (Id) {
        case lighthouseId:
            t = new THREE.Vector3(0, 0, 0);
            figure[lighthouseId] = createNode(t, lighthousea, null, boatId);
            break;

        case boatId:
            t1 = t.add(new THREE.Vector3(270, -6, 600));
            figure[boatId] = createNode(t1, boata, null, rod1Id);
            break;

        case rod1Id:
            t2 = t1.add(new THREE.Vector3(0, 0, 0));
            figure[rod1Id] = createNode(t2, roda, null, rod2Id);
            break;

        case rod2Id:
            t3 = t2.add(new THREE.Vector3(0, 0, 0));
            figure[rod2Id] = createNode(t3, rodb, null, rod3Id);
            break;

        case rod3Id:
            t4 = t3.add(new THREE.Vector3(0, 0, 0));
            figure[rod3Id] = createNode(t4, rodc, null, null);
            break;
    }
}

function traverse(Id) {
    if (Id == null)
        return;
    stack.push(m);
    m.dot(figure[Id].transform)
    figure[Id].render();
    if (figure[Id].child != null)
        traverse(figure[Id].child);
    m = stack.pop();
    if (figure[Id].sibling != null)
        traverse(figure[Id].sibling);
}


///////////////////
//QUICKTIME EVENT
///////////////////

function endQTEvent() {
    bar.progress = 100;
    bar.style.visibility = 'hidden';
    progress.style.visibility = 'hidden';
    var randX = THREE.Math.randFloatSpread(750);
    var randZ = THREE.Math.randFloatSpread(750);
    pesce[baited].position.set(randX, -20, randZ);
    movingCubes[baited].position.set(randX, -20, randZ);

    console.log("Event Ended!");

    flag = true;
    //endQTEvent = false;
}

function SetBarsAsUndefined() {
    bar.setUndeterminated(1);
}

function SetBarsAsDefined() {
    bar.setUndeterminated(0);
}

function UpdateBars() {
    bar.progress++;
    if (document.getElementById("bar-1").progress < 100) {
        setTimeout(UpdateBars, 10);
    } else {
        endQTEvent();
    }
}
// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}



init();
initBasicGraphics();
//initCustomModels();
//initSounds();
//initSounds Replaced called in browser detection
BrowserDetection();

function init() {
    ///////////////////
    //CAMERA
    ///////////////////

    container = document.getElementById('container');

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(159, 10, 552);

    
    

    /* camera.lookAt(0, 0, 0);
    window.addEventListener('mousemove', function (e) {
        var mouse3D = new THREE.Vector3(
            ((event.clientX / window.innerWidth) * 2 - 1) * 300,
            (-(event.clientY / window.innerHeight) * 2 + 1) * 300,
            0.5);
        camera.lookAt(mouse3D);
    }); */

    /* IF YOU NEED A 360 DEGREES CAMERA, YOU CAN USE POINTERLOCKCONTROL
    EXAMPLE IS DINO:
    https://codepen.io/MSEdgeDev/pen/NpKejy */

    /* var looking = new THREE.PointerLockControls( camera );
    scene.add( looking.getObject() ); */
    //looking.enabled = true; // Turns on camera rotating with mouse


    ///////////////////
    //LIGHTS & SHADOWS
    ///////////////////


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    light2 = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light2);

    light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(400, 400, 400);
    light.castShadow = true;
    scene.add(light);
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500 // default

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    //STATS TOP LEFT
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px'
    container.appendChild(stats.domElement);

    //INFO
    info = document.getElementById('info');
    info.style.position = 'absolute';
    info.style.top = '0%';
    info.style.left = '0%';
    container.appendChild(info);

    //PROGRESS BAR
    progress = document.getElementById('progressBar');
    progress.style.position = 'absolute';
    progress.style.top = '50%';
    progress.style.left = '50%';
    progress.style.visibility = 'hidden';
    container.appendChild(progress);

    // SCORE
    score = document.getElementsByClassName("item")[0];
    score.style.position = 'absolute';
    score.style.top = '0%';
    score.style.right = '0%';
    container.appendChild(score);
    goldfish = document.getElementsByClassName("goldFish")[0];
    container.appendChild(goldfish);

    window.addEventListener('resize', onWindowResize, false);
}


function initBasicGraphics() {

    ///////////////////
    //WATER
    ///////////////////

    var params = {
        color: '#ffffff',
        scale: 4,
        flowX: 1,
        flowY: 1
    };

    var waterGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
    water = new THREE.Water(waterGeometry, {
        color: params.color,
        scale: params.scale,
        flowDirection: new THREE.Vector2(params.flowX, params.flowY),
        textureWidth: 1024,
        textureHeight: 1024
    });
    water.position.y = -11;
    water.rotation.x = Math.PI * -0.5;
    scene.add(water);


    ///////////////////
    //SKY
    ///////////////////

    // Add Sky
    sky = new THREE.Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );
    sunSphere.position.y = -700000;
    sunSphere.visible = false;
    scene.add(sunSphere);

    var distance = 400000;

    var effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.55, // elevation / inclination
        azimuth: 0.6, // Facing front,
        sun: !true
    };

    var uniforms = sky.material.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;
    var theta = Math.PI * (effectController.inclination - 0.5);
    var phi = 2 * Math.PI * (effectController.azimuth - 0.5);
    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    sunSphere.visible = effectController.sun;
    uniforms.sunPosition.value.copy(sunSphere.position);
}

//function initCustomModels() {
///////////////////
//3D MODELS
///////////////////
var loader = new THREE.GLTFLoader();

function lighthousea() {
    loader.load(
        '/models/lighthouse/model.gltf',
        function (gltf) {
            gltf.scene.castShadow = true;
            gltf.scene.name = "lighthouse";
            gltf.scene.position.y = -13;

            lighthouse = gltf.scene;
            scene.add(lighthouse);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            if (xhr.loaded / xhr.total == 1) {}
        },
        function (error) {
            console.log('An error happened');
        }
    );
}

function boata() {
    loader.load(
        '/models/boat2/scene.gltf',
        function (gltf) {
            gltf.scene.castShadow = true;
            gltf.scene.name = "boat";
            gltf.scene.position.set(270, -6, 600);
            gltf.scene.scale.set(3, 3, 3);

            boat = gltf.scene;
            scene.add(boat);
            boatFlag = true;

        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            if (xhr.loaded / xhr.total == 1) {}
        },
        function (error) {
            console.log('An error happened');
        }
    );
}

/* loader.load(
    '/models/rod/scene.gltf',
    function (gltf) {
        gltf.scene.position.set(170, 10, 570);
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.castShadow = true;
        scene.add(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
); */

function roda() {
    loader.load(
        '/models/rod/rod13.gltf',
        function (gltf) {
            rod1 = THREE.Object3D.prototype.clone.call(gltf.scene);
            // rod1.rotation.x = -2;
            // rod1.position.set(170, 5, 565);
            rod1.position.set(t2.x, t2.y + 5, t2.z);
            // rod1.position.set(t2.x, t2.y, t2.z);
            rod1.scale.set(5, 5, 5);
            rod1.castShadow = true;
            scene.add(rod1);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );

}
//Adding the rod rope (the function will be used when the new node for the rod rope is created)
function rodb() {
    loader.load(
        '/models/rod/rod14.gltf',
        function (gltf) {
            rod2 = THREE.Object3D.prototype.clone.call(gltf.scene);
            // rod2.rotation.x = -1.6;
            // rod2.position.set(170, 4.5, 565);
            rod2.position.set(t3.x, t3.y + 5, t3.z);
            // rod2.position.set(t3.x, t3.y, t3.z);
            rod2.scale.set(5, 5, 5);
            rod2.castShadow = true;
            scene.add(rod2);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );
}
//Adding the rod bait (the function will be used when the new node for the rod bait is created)
function rodc() {
    loader.load(
        '/models/rod/rod15.gltf',
        function (gltf) {
            rod3 = THREE.Object3D.prototype.clone.call(gltf.scene);
            // rod2.rotation.x = -1.6;
            // rod2.position.set(170, 4.5, 565);
            rod3.position.set(t4.x, t4.y + 5, t4.z);
            // rod2.position.set(t3.x, t3.y, t3.z);
            rod3.scale.set(5, 5, 5);
            rod3.castShadow = true;


            //COLLISION BOXES
            var params = {
                opacity: 0
            };
            var center = new THREE.Vector3();
            var box = new THREE.Box3().setFromObject(rod3);
            var cubeGeometry = new THREE.BoxGeometry(box.getSize(center).x, box.getSize(center).y, box.getSize(
                center).z);
            var wireMaterial = new THREE.MeshBasicMaterial({
                opacity: params.opacity,
                // transparent: true,
                color: 0xFFFFFF,
                wireframe: true
            });
            baitBox = new THREE.Mesh(cubeGeometry, wireMaterial);
            baitBox.scale.set(5, 5, 5);
            baitBox.position.x = 950;
            baitBox.position.y = 950;
            baitBox.position.z = 950;
            collidableMeshList.push(baitBox);

            scene.add(rod3);
            scene.add(baitBox);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );
}

loader.load(
    '/models/fish/scene.gltf',
    function (gltf) {
        gltf.scene.scale.set(0.05, 0.05, 0.05);
        gltf.scene.castShadow = true;
        for (var i = 0; i < 100; i++) {
            x = THREE.Math.randFloatSpread(1000);
            z = THREE.Math.randFloatSpread(1000);
            gltf.scene.position.set(x, -20, z);
            gltf.scene.name = "pesce" + i.toString();
            gltf.scene.rotation.y = Math.random() * (2 * Math.PI) - Math.PI;
            pesce[i] = THREE.Object3D.prototype.clone.call(gltf.scene)

            //COLLISION BOXES
            var params = {
                opacity: 0
            };
            var center = new THREE.Vector3();
            var box = new THREE.Box3().setFromObject(pesce[i]);
            var cubeGeometry = new THREE.BoxGeometry(box.getSize(center).x, box.getSize(center).y, box.getSize(
                center).z);
            var wireMaterial = new THREE.MeshBasicMaterial({
                opacity: params.opacity,
                transparent: true,
                // color: 0xFFFFFF,
                wireframe: true
            });
            movingCubes[i] = new THREE.Mesh(cubeGeometry, wireMaterial);
            movingCubes[i].position.x = pesce[i].position.x;
            movingCubes[i].position.y = pesce[i].position.y + 2.5;
            movingCubes[i].position.z = pesce[i].position.z;

            //collidableMeshList.push(movingCubes[i]);

            scene.add(pesce[i]);
            scene.add(movingCubes[i]);
        }
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);


///////////////////
//FISH MOVEMENT
///////////////////

function movimentoPesce(oggetto) {
    for (var i = 0; i < oggetto.length; i++) {
        var randDegrees = Math.floor(Math.random() * 720) - 360;
        var randRadians = Math.radians(randDegrees);
        var x = 0.5 * Math.cos(randRadians);
        var z = 0.5 * Math.sin(randRadians);
        if (oggetto[i].position.x + x > 500 || oggetto[i].position.x + x < -500 || oggetto[i].position.z + z >
            500 || oggetto[i].position.z + z < -500) {
            var randX = THREE.Math.randFloatSpread(750);
            var randZ = THREE.Math.randFloatSpread(750);
            oggetto[i].position.set(randX, -20, randZ);
            movingCubes[i].position.set(randX, -20, randZ);
        }

        function r1(oggetto, i, cubo) {

            //TO SLOW DOWN FISH MOVEMENT, UNCOMMENT SETTIMEOUT
            //setTimeout(function () {
            if (randRadians > oggetto.rotation.y) {
                var deltax = oggetto.position.x;
                var deltaz = oggetto.position.z;
                oggetto.rotation.y += 0.17;
                oggetto.translateOnAxis(xAxis, -0.5);
                deltax = oggetto.position.x - deltax;
                deltaz = oggetto.position.z - deltaz;
                cubo.position.x += deltax;
                cubo.position.z += deltaz;
                r1(oggetto, i, cubo);
            }
            //}, 300);
        }

        function r2(oggetto, i, cubo) {
            //setTimeout(function () {
            if (randRadians < oggetto.rotation.y) {
                var deltax = oggetto.position.x;
                var deltaz = oggetto.position.z;
                oggetto.rotation.y -= 0.17;
                oggetto.translateOnAxis(xAxis, -0.5);
                deltax = oggetto.position.x - deltax;
                deltaz = oggetto.position.z - deltaz;
                cubo.position.x += deltax;
                cubo.position.z += deltaz;
                r2(oggetto, i, cubo);
            }
            //}, 300);
        }

        randRadians = randRadians + oggetto[i].rotation.y
        if (randRadians > oggetto[i].rotation.y) {
            r1(oggetto[i], i, movingCubes[i]);
        } else {
            r2(oggetto[i], i, movingCubes[i]);
        }
    }
}

function polarToCartesian(radius, angle) {
    return [radius * Math.cos(angle), radius * Math.sin(angle)]
}

///////////////////
//COLLISION
///////////////////


//POSSIBLE INVERSION OF "MOVINGCUBES[I]" AND "BAITBOX"(COLLIDABLEMESHLIST)
function collision(obj) {
    for (var i = 0; i < obj.length; i++) {
        var originPoint = movingCubes[i].position.clone();
        for (var vertexIndex = 0; vertexIndex < movingCubes[i].geometry.vertices.length; vertexIndex++) {
            var localVertex = movingCubes[i].geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(movingCubes[i].matrix);
            var directionVector = globalVertex.sub(movingCubes[i].position);

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                console.log(" Hit with n: " + i.toString());
                baited = i;
                quickTime = true;
                continue;
            }

        }
    }
}

function initSounds(extension) {
    var audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    whistle = new THREE.Audio(audioListener);
    scene.add(whistle);
    cast = new THREE.Audio(audioListener);
    scene.add(cast);
    pullup = new THREE.Audio(audioListener);
    scene.add(pullup);

    var loader = new THREE.AudioLoader();
    loader.load(
        'sounds/whistle.' + extension,
        function (audioBuffer) {
            whistle.setBuffer(audioBuffer);
            whistle.setLoop(true);
            whistle.setVolume(0.75);
            whistle.play();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (err) {
            console.log('An error happened');
        }
    );

    loader.load(
        'sounds/cast.' + extension,
        function (audioBuffer) {
            cast.setBuffer(audioBuffer);
            cast.setVolume(1.25);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (err) {
            console.log('An error happened');
        }
    );

    loader.load(
        'sounds/pullup.' + extension,
        function (audioBuffer) {
            pullup.setBuffer(audioBuffer);
            pullup.setVolume(1.25);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (err) {
            console.log('An error happened');
        }
    );
}

///////////////////
//ANIMATION
///////////////////

var animate = function () {
    requestAnimationFrame(animate);

    stats.update();

    keyboard.update();

    //ORBIT CONTROL
    if (controlFlag){
        var controls = new THREE.OrbitControls(camera);
        controls.update();
    }

    if (quickTime) {
        flag = false;
        bar.progress = 0;
        progress.style.visibility = 'visible';
        bar.style.visibility = 'visible';
        UpdateBars();

        quickTime = false;
        pressSpace = true;
    }

    var time = performance.now() * 0.001;
    if (boatFlag) {
        boat.rotation.x = Math.sin(time) * 0.015;
    }

    if (flag) {
        baitBox.position.y = -17.5;
        movimentoPesce(pesce);
        collision(pesce);
    }



    if (pressSpace) {
        if (keyboard.down("space")) {
            //endQTEvent();
            pullup.play();
            collisi = true;
            updateScore(collisi);
            console.log("got it!");
            bar.progress = 100;

            //flag = true;
            pressSpace = false;
        }
    }

    if (keyboard.down("enter")) {
        info.style.visibility = 'hidden';
    }

    if (castFlag) {
        cast.play();
        castFlag = false;
    }

    renderer.render(scene, camera);
};

animate();

var render = function () {
    traverse(lighthouseId);
    camera.position.set(t1.x, t1.y + 10, t1.z);
    requestAnimationFrame(animate);
}
// create the nodes
for (i = 0; i <= numNodes; i++) initNodes(i);
render();

var max = 100;
var initialOffset = '175';
var j = 0;
var updateScore = function (collisi) {
    if (collisi == true) {
        j += 1;
        /* Need initial run as interval hasn't yet occured... */
        $('.circle_animation').css('stroke-dashoffset', initialOffset - (1 * (initialOffset / max)));

        var interval = setInterval(function () {
            $('h2').text(j);
            if (j == max) {
                clearInterval(interval);
                alert("YOU WON");
                return; //endQTEvent
            }

            $('.circle_animation').css('stroke-dashoffset', initialOffset - ((j + 1) * (initialOffset / max)));

        }, 1000);
    }
}

// Animating the boat
// W, A, S, D keys are used to move the boat, and F, G are used to throw and pull the rod
var map = {
    87: false,
    83: false,
    65: false,
    68: false,
    70: false,
    71: false
};
document.addEventListener("keydown", keyDownTextField, false);


function keyDownTextField(e) {

    var xSpeed = 10;
    var zSpeed = 10;
    var rota = 2 * Math.PI / 180;
    var bpos = boat.position;
    var brot = boat.rotation;
    var cpos = camera.position;
    var crot = camera.rotation;
    var r1pos = rod1.position;
    var r2pos = rod2.position;
    var r3pos = rod3.position;
    var r1rot = rod1.rotation;
    var r2rot = rod2.rotation;
    var r3rot = rod3.rotation;
    var bBoxpos = baitBox.position;
    var cos = Math.cos;
    var sin = Math.sin;



    function f1() {
        setTimeout(function () {
            //about 26 step
            if (r2pos.y < -1) {
                r1rot.x = 0;
                rod2.scale.set(5, 14 + scale, 5);
                r2pos.y += 0.5;
                r3pos.y += 0.57;
                r2pos.z = bpos.z;
                r3pos.z = r2pos.z;
                scale -= 0.3461;
                f1()
            }
        }, 100);
    }

    function f2() {
        setTimeout(function () {
            //about 26 step
            if (r2pos.y > -14) {
                rod2.scale.set(5, 5-scale, 5);
                r2pos.y -= 0.5;
                r3pos.y -=0.57;
                r2pos.z = bpos.z + sin(brot.y + 3);
                r3pos.z = r2pos.z;
                bBoxpos.x = r3pos.x;
                bBoxpos.y = r3pos.y;
                bBoxpos.z = r3pos.z;
                scale -= 0.3461;
                f2()
            }
        }, 100);
    }

    if (e.keyCode in map) {
        map[e.keyCode] = true;
        if (map[87] && map[65]) { // forward + left movement
            bpos.z = bpos.z - sin(brot.y) * zSpeed;
            bpos.x = bpos.x + cos(brot.y) * xSpeed;
            brot.y += rota;
        } else if (map[87] && map[68]) { // forward + right movement
            bpos.z = bpos.z - sin(brot.y) * zSpeed;
            bpos.x = bpos.x + cos(brot.y) * xSpeed;
            brot.y -= rota;
        } else if (map[87]) { // forward movement
            bpos.z = bpos.z - sin(brot.y) * zSpeed;
            bpos.x = bpos.x + cos(brot.y) * xSpeed;
        } else if (map[83] && map[65]) { // backward + left movement
            bpos.z = bpos.z + sin(brot.y) * zSpeed;
            bpos.x = bpos.x - cos(brot.y) * xSpeed;
            brot.y -= rota;
        } else if (map[83] && map[68]) { // backward + right movement
            bpos.z = bpos.z + sin(brot.y) * zSpeed;
            bpos.x = bpos.x - cos(brot.y) * xSpeed;
            brot.y += rota;
        } else if (map[83]) { // backward movement
            bpos.z = bpos.z + sin(brot.y) * zSpeed;
            bpos.x = bpos.x - cos(brot.y) * xSpeed;
        }

        if (boat.position.z <= -940 || boat.position.x <= -940 || boat.position.z >= 940 || boat.position.x >=
            940) {
            brot.y += 120 * Math.PI / 180;
        }
        //cpos.x = bpos.x;
        //cpos.y = bpos.y + 5;
        //cpos.z = bpos.z - 5;
        //crot.y = brot.y - (90 * Math.PI / 180);
        r1pos.x = bpos.x;
        r1pos.z = bpos.z;
        r2pos.x = bpos.x;
        r2pos.z = bpos.z;
        r3pos.x = bpos.x;
        r3pos.z = bpos.z;
        r1rot.y = brot.y;
        r2rot.y = brot.y;
        r3rot.y = brot.y;
        r2pos.z = bpos.z + sin(brot.y + 3);
        r3pos.z = r2pos.z;
        baitBox.position.x = 950;
        baitBox.position.y = 950;
        baitBox.position.z = 950;

        //              up ---> down
        // r1pos.y      -1      -1
        // r2pos.y      -1      -14
        // r3pos.y      -1      -16


        if (map[70]) { // pull the rod
            if (insideWater) {
                var scale = -0.3461;
                f1();
            }
            insideWater = false;
         }
        if (map[71]) { // throw the rod
            if (!insideWater) {
                var scale = -0.3461;
                f2();
            }
            insideWater = true;

        }
    }
}

document.onkeyup = myKeyUpHandler;

function myKeyUpHandler(e) {
    var brot = boat.rotation;
    var bpos = boat.position
    //var crot = camera.rotation;
    //var cpos = camera.position;
    if (e.keyCode in map) {
        map[e.keyCode] = false;
        //crot.y = brot.y;
        //cpos.x = bpos.x-14;
    }
};