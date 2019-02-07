var prototypeProgressBar = xtag.register('prototype-progress-bar', {
    content: '',
    accessors: {
        isundeterminated: {
            attribute: {},
            get: function () {
                return this.privateisundeterminated || 0;
            },
            set: function () {
                alert("Attention!\n\n'isundeterminated' is a read only accessor.\nTo set a progress bar as indeterminated use '[bar].setIndeterminated(1);'");
            }
        },
        privateisundeterminated: {
            attribute: {
                validate: function (val) {
                    if (typeof val != "number" || isNaN(val) || val < 0) {
                        return 0;
                    } else if (val > 1) {
                        return 1;
                    }
                    return val;
                }
            },
            set: function (value) {
                this.xtag.data.privateisundeterminated = value;
            },
            get: function () {
                return this.getAttribute('privateisundeterminated') || 0;
            }
        },
        privateundeterminatedindex: {
            attribute: {
                validate: function (val) {
                    if (typeof val != "number" || isNaN(val) || val < 0) {
                        return 0;
                    } else if (val > 360) {
                        return 360;
                    }
                    return val;
                }
            },
            set: function (value) {
                this.xtag.data.privateundeterminatedindex = value;
            },
            get: function () {
                return this.getAttribute('privateundeterminatedindex') || false;
            }
        },
        privateundeterminedtimer: {
            attribute: {},
            set: function (value) {
                this.xtag.data.privateundeterminedtimer = value;
            },
            get: function () {
                return this.getAttribute('privateundeterminedtimer') || false;
            }
        },
        filledcolor: {
            attribute: {},
            set: function (value) {
                this.xtag.data.filledcolor = value;
            },
            get: function () {
                return this.getAttribute('filledcolor') || "#828282";
            }
        },
        barcolor: {
            attribute: {},
            set: function (value) {
                this.xtag.data.barcolor = value;
            },
            get: function () {
                return this.getAttribute('barcolor') || "#BEBEBE";
            }
        },
        progress: {
            attribute: {
                validate: function (val) {
                    return val < 0 ? 0 : (val > 100 ? 100 : val);
                }
            },
            set: function (value) {
                this.xtag.data.progress = value;

            },
            get: function () {
                return this.getAttribute('progress') || 0;
            }
        },
        displaytextwhendone: {
            set: function (value) {
                this.xtag.data.displaytextwhendone = value;
            },
            get: function () {
                return this.getAttribute('displaytextwhendone') || true;
            }
        },
        donetext: {
            set: function (value) {
                this.xtag.data.donetext = value;
            },
            get: function () {
                return this.getAttribute('donetext') || "Done!";
            }
        },
        progressstringformat: {
            set: function (value) {
                this.xtag.data.progressstringformat = value;
            },
            get: function () {
                return this.getAttribute('progressstringformat') || "{p}";
            }
        }
    }
});

var circularProgressBar = xtag.register('circular-progress-bar', {
    prototype: prototypeProgressBar.prototype,
    lifecycle: {
        created: function () {
            this.updateLayoutFor("all");
        },
        inserted: function () {
            this.privateisundeterminated = 0;
        },
        attributeChanged: function (attrName, oldValue, newValue) {
            this.updateLayoutFor(attrName);
        }
    },
    content: function () {
        /*
                <link rel="stylesheet" type="text/css" href="templates/css/circular-progress-bar.css">

                <div class="bar_container" id="bar_container">
                    <div class="bar_border">
                        <div class="bar_circle">
                            <span class="bar_progress">p</p>
                        </div>
                    </div>
                </div>
            */
    },
    accessors: {
        circlesize: {
            attribute: {},
            set: function (value) {
                this.xtag.data.circlesize = value;
            },
            get: function () {
                return this.getAttribute('circlesize') || 150;
            }
        },
        barsize: {
            attribute: {},
            set: function (value) {
                this.xtag.data.barsize = value;
            },
            get: function () {
                return this.getAttribute('barsize') || 6;
            }
        },
        circlebackground: {
            attribute: {},
            set: function (value) {
                this.xtag.data.circlebackground = value;
            },
            get: function () {
                return this.getAttribute('circlebackground') || "#FFFFFF";
            }
        }
    },
    methods: {
        setUndeterminated: function (isUndeterminated) {
            if (this.privateisundeterminated !== isUndeterminated) {
                this.privateisundeterminated = isUndeterminated;

                var container = xtag.queryChildren(this, 'div.bar_container')[0];
                var border = xtag.queryChildren(container, 'div.bar_border')[0];
                var circle = xtag.queryChildren(border, 'div.bar_circle')[0];
                var progress = xtag.queryChildren(circle, 'span')[0];
                var status = GetElementInsideContainer(container, "bar_status");

                if (this.privateisundeterminated == 1) {
                    this.privateundeterminatedindex = 0;

                    progress.style.visibility = "hidden";
                    this.privateundeterminedtimer = setInterval(this.privateAdvanceUndeterminated, 30, this, xtag.queryChildren(container, 'div.bar_border')[0]);
                } else {
                    clearInterval(this.privateundeterminedtimer);
                    this.updateColorOrProgress();
                    progress.style.visibility = "visible";
                }
            }

        },

        privateAdvanceUndeterminated: function (obj, border) {
            if (obj.progress == 100) {
                obj.setUndeterminated(0);
                return;
            }

            obj.privateundeterminatedindex = parseInt(obj.privateundeterminatedindex) + 10;

            var degree = obj.privateundeterminatedindex;

            if (obj.privateundeterminatedindex > 359) {
                obj.privateundeterminatedindex = 0;
            }

            var first_angle = degree - 225;
            var second_angle = degree;

            if (first_angle < 0) {
                first_angle += 360;
            }

            border
                .style
                .backgroundImage = 'linear-gradient(' + first_angle + 'deg, transparent 50%, ' + obj.filledcolor + ' 50%),linear-gradient(' + second_angle + 'deg, transparent 50%, ' + obj.filledcolor + ' 50%),linear-gradient(' + second_angle + 'deg, ' + obj.barcolor + ' 50%, transparent 50%)';


        },

        updateLayoutFor: function (attrName) {
            if (this.privateisundeterminated == 1) {
                return;
            }
            switch (attrName) {
                case "progress":
                case "barcolor":
                case "filledcolor":
                    this.updateColorOrProgress();
                    break;

                case "circlesize":
                case "barsize":
                    this.updateSize();
                    break;

                case "all":
                    this.updateColorOrProgress();
                    this.updateSize();
                    break;
            }
        },

        updateColorOrProgress: function () {
            var container = xtag.queryChildren(this, 'div.bar_container')[0];
            var border = xtag.queryChildren(container, 'div.bar_border')[0];
            var circle = xtag.queryChildren(border, 'div.bar_circle')[0];
            var progress = xtag.queryChildren(circle, 'span')[0];

            if (this.displaytextwhendone == 1 && this.progress == 100) {
                progress.innerHTML = this.donetext;
            } else {
                progress.innerHTML = this.progressstringformat.replace("{p}", Math.round(this.progress));
            }

            if (this.progress <= 50) {
                border.style.backgroundImage = 'linear-gradient(' + (this.progress * 3.6 + 90) + 'deg, transparent 50%, ' + this.barcolor + ' 50%),linear-gradient(270deg, ' + this.filledcolor + ' 50%, ' + this.barcolor + ' 50%)';
            } else {
                border.style.backgroundImage = 'linear-gradient(90deg, transparent 50%, ' + this.filledcolor + ' 50%), linear-gradient(' + (this.progress * 3.6 + 270) + 'deg, ' + this.barcolor + ' 50%, ' + this.filledcolor + ' 50%)';
            }

            circle.style.backgroundColor = this.circlebackground;

            progress.style.color = 'rgb(' + getColorBetweenColors(hexToRgb(this.filledcolor), hexToRgb(this.filledcolor), this.progress).join() + ')';
        },

        updateSize: function () {
            var container = xtag.queryChildren(this, 'div.bar_container')[0];
            var border = xtag.queryChildren(container, 'div.bar_border')[0];
            var circle = xtag.queryChildren(border, 'div.bar_circle')[0];

            container.style.width = this.circlesize;
            container.style.height = this.circlesize;

            border.style.width = this.circlesize;
            border.style.height = this.circlesize;

            circle.style.top = this.barsize;
            circle.style.left = this.barsize;

            circle.style.width = this.circlesize - (2 * this.barsize);
            circle.style.height = this.circlesize - (2 * this.barsize);
        },

        updatecirclebackground: function () {
            var container = xtag.queryChildren(this, 'div.bar_container')[0];
            var border = xtag.queryChildren(container, 'div.bar_border')[0];
            var circle = xtag.queryChildren(border, 'div.bar_circle')[0];

            circle.style.backgroundColor = this.circlebackground;
        }
    }
});

var circularProgressBarStatus = xtag.register('circular-progress-bar-status', {
    prototype: circularProgressBar.prototype,
    lifecycle: {
        created: function () {
            var container = xtag.queryChildren(this, 'div.bar_container')[0];
            container.innerHTML += '<p id="bar_status" class="bar_status">' + this.status + '</p>';
            this.updateLayoutFor("all");
        },
        attributeChanged: function (attrName, oldValue, newValue) {
            this.updateLayoutFor(attrName);
        }
    },
    accessors: {
        status: {
            attribute: {},
            set: function (value) {
                this.xtag.data.status = value;
            },
            get: function () {
                return this.getAttribute('status') || "";
            }
        }
    },
    methods: {
        updateLayoutFor: function (attrName) {
            switch (attrName) {
                case "status":
                    this.updateStatus();
                    break;

                default:
                    this.updateStatus();
                    break;
            }
        },
        updateStatus: function () {
            var container = xtag.queryChildren(this, 'div.bar_container')[0];
            var border = xtag.queryChildren(container, 'div.bar_border')[0];
            var circle = xtag.queryChildren(border, 'div.bar_circle')[0];
            var progress = xtag.queryChildren(circle, 'span')[0];
            var status = GetElementInsideContainer(container, "bar_status");

            container.style.height = parseInt(this.circlesize) + parseInt(status.offsetHeight);

            status.innerHTML = (this.progress == 100 ? "" : this.status);
        }
    }
});

/* Useful functions */

/*
    getColorBetweenColors:
    Author: passatgt (http://stackoverflow.com/users/517840/passatgt)
    At: http://stackoverflow.com/a/30144587/5686352
    Based on: mix() at less.js
*/
function getColorBetweenColors(color1, color2, weight) {
    var p = weight / 100;
    var w = p * 2 - 1;
    var w1 = (w / 1 + 1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return rgb;
}

/*
    hexToRgb:
    Author: Tim Down (http://stackoverflow.com/users/96100/tim-down)
    At: http://stackoverflow.com/a/5624139/5686352
*/
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

/*
    GetElementInsideContainer:
    Based on function by: naveen (http://stackoverflow.com/users/17447/naveen)
    At: http://stackoverflow.com/a/7171590/5686352
*/
function GetElementInsideContainer(container, childID) {
    var elm = {};
    var elms = container.getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
        if (elms[i].id === childID) {
            elm = elms[i];
            break;
        }
    }
    return elm;
}