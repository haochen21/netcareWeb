angular.module('netcareApp')
    .directive('bizStatusTopo', function () {
        return {
            restrict: 'A',
            scope: {
                siteMapData: '=',
                clickLinkCircuits: '='
            },
            link: function (scope, element) {
                var width = element[0].offsetWidth,
                    height = element[0].offsetHeight,
                    charge = element[0].offsetWidth > 768 ? -6000 : -600;

                var force = d3.layout.force()
                    .charge([charge])
                    .linkDistance(200)
                    .gravity(0.3)
                    .size([width, height]);

                force.on("tick", function () {
                    link.attr("d", function (d) {
                        if (d.linkNo && d.target.id != d.source.id) {
                            var source_x = d.source.x,
                                source_y = d.source.y,
                                target_x = d.target.x,
                                target_y = d.target.y;
                            var maxAngle = 150;
                            var minPerAngle = 25;
                            var expandDistance = 40;
                            var total = d.total;
                            var index = d.linkNo;
                            if (minPerAngle * (total - 1) < maxAngle) {
                                maxAngle = minPerAngle * (total - 1);
                            }
                            var distanceBetweenAZ = Math.sqrt((target_x - source_x) * (target_x - source_x)
                            + (target_y - source_y) * (target_y - source_y));
                            if (distanceBetweenAZ < 2 * expandDistance) {
                                expandDistance = distanceBetweenAZ / 2;
                            }
                            var tan = (target_y - source_y) / (target_x - source_x);
                            var sin = Math.abs(Math.sin(Math.atan(tan)));
                            var cos = Math.cos(Math.atan(tan));
                            var staightDistance = Math.tan(maxAngle / 2 * Math.PI / 180) * expandDistance * 2;
                            var bassXFrom = d.source.x + cos * expandDistance - sin * staightDistance / 2;
                            var bassYFrom = d.source.y + sin * expandDistance + staightDistance / 2;
                            var stepX = staightDistance * sin / (total - 1);
                            var stepY = staightDistance * cos / (total - 1);
                            var xFrom = bassXFrom + (index - 1) * stepX;
                            var yFrom = bassYFrom - (index - 1) * stepY;

                            var bassXTo = target_x - cos * expandDistance - sin * staightDistance / 2;
                            var bassYTo = target_y - sin * expandDistance + cos * staightDistance / 2;
                            var xTo = bassXTo + (index - 1) * stepX;
                            var yTo = bassYTo - (index - 1) * stepY;
                            return "M " + source_x + " " + source_y
                                + " L " + xFrom + " " + yFrom
                                + " L " + xTo + " " + yTo
                                + " L " + target_x + " " + target_y;

                        } else {
                            // Self edge.
                            var x1 = d.source.x,
                                y1 = d.source.y,
                                x2 = d.target.x,
                                y2 = d.target.y;
                            if (x1 === x2 && y1 === y2) {
                                if (d.linkNo) {
                                    var dx1 = x1 - d.linkNo * 40,
                                        dy1 = y1 - d.linkNo * 40,
                                        dx2 = dx1 + d.linkNo * 80,
                                        dy2 = dy1,
                                        dx3 = x1,
                                        dy3 = y1;
                                    return "M " + x1 + " " + y1 + " L " + dx1 + " " + dy1 + " L " + dx2 + " " + dy2 + " L " + dx3 + " " + dy3;
                                } else {
                                    var dx1 = x1 - 40,
                                        dy1 = y1 - 40,
                                        dx2 = dx1 + 80,
                                        dy2 = dy1,
                                        dx3 = x1,
                                        dy3 = y1;
                                    return "M " + x1 + " " + y1 + " L " + dx1 + " " + dy1 + " L " + dx2 + " " + dy2 + " L " + dx3 + " " + dy3;
                                }
                            } else {
                                var leftHand = d.source.x < d.target.x;
                                if (leftHand) {
                                    return "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
                                } else {
                                    return "M " + x2 + " " + y2 + " L " + x1 + " " + y1;
                                }
                            }
                        }
                    });

                    node.attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });


                });

                var zoom = d3.behavior.zoom()
                    .scaleExtent([1, 10])
                    .on("zoom", function () {
                        topoContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    });

                var node_drag = d3.behavior.drag()
                    .on("dragstart", function (d, i) {
                        d3.event.sourceEvent.stopPropagation();
                        // stops the force auto positioning before you start dragging
                        force.stop()
                    })
                    .on("drag", function (d, i) {
                        d.px += d3.event.dx;
                        d.py += d3.event.dy;
                        d.x += d3.event.dx;
                        d.y += d3.event.dy;
                        // updating both px,py,x,y on d !
                        link.attr("d", function (d) {
                            if (d.linkNo && d.target.id != d.source.id) {
                                var source_x = d.source.x,
                                    source_y = d.source.y,
                                    target_x = d.target.x,
                                    target_y = d.target.y;
                                var maxAngle = 150;
                                var minPerAngle = 25;
                                var expandDistance = 40;
                                var total = d.total;
                                var index = d.linkNo;
                                if (minPerAngle * (total - 1) < maxAngle) {
                                    maxAngle = minPerAngle * (total - 1);
                                }
                                var distanceBetweenAZ = Math.sqrt((target_x - source_x) * (target_x - source_x)
                                + (target_y - source_y) * (target_y - source_y));
                                if (distanceBetweenAZ < 2 * expandDistance) {
                                    expandDistance = distanceBetweenAZ / 2;
                                }
                                var tan = (target_y - source_y) / (target_x - source_x);

                                var sin = (target_y - source_y >= 0 ? 1 : -1) * Math.abs(Math.sin(Math.atan(tan)));
                                var cos = (target_x - source_x >= 0 ? 1 : -1) * Math.cos(Math.atan(tan));
                                var staightDistance = Math.tan(maxAngle / 2 * Math.PI / 180) * expandDistance * 2;
                                var bassXFrom = d.source.x + cos * expandDistance - sin * staightDistance / 2;
                                var bassYFrom = d.source.y + sin * expandDistance + staightDistance / 2;
                                var stepX = staightDistance * sin / (total - 1);
                                var stepY = staightDistance * cos / (total - 1);
                                var xFrom = bassXFrom + (index - 1) * stepX;
                                var yFrom = bassYFrom - (index - 1) * stepY;

                                var bassXTo = target_x - cos * expandDistance - sin * staightDistance / 2;
                                var bassYTo = target_y - sin * expandDistance + cos * staightDistance / 2;
                                var xTo = bassXTo + (index - 1) * stepX;
                                var yTo = bassYTo - (index - 1) * stepY;
                                return "M " + source_x + " " + source_y
                                    + " L " + xFrom + " " + yFrom
                                    + " L " + xTo + " " + yTo
                                    + " L " + target_x + " " + target_y;

                            } else {
                                // Self edge.
                                var x1 = d.source.x,
                                    y1 = d.source.y,
                                    x2 = d.target.x,
                                    y2 = d.target.y;
                                if (x1 === x2 && y1 === y2) {
                                    if (d.linkNo) {
                                        var dx1 = x1 - d.linkNo * 40,
                                            dy1 = y1 - d.linkNo * 40,
                                            dx2 = dx1 + d.linkNo * 80,
                                            dy2 = dy1,
                                            dx3 = x1,
                                            dy3 = y1;
                                        return "M " + x1 + " " + y1 + " L " + dx1 + " " + dy1 + " L " + dx2 + " " + dy2 + " L " + dx3 + " " + dy3;
                                    } else {
                                        var dx1 = x1 - 40,
                                            dy1 = y1 - 40,
                                            dx2 = dx1 + 80,
                                            dy2 = dy1,
                                            dx3 = x1,
                                            dy3 = y1;
                                        return "M " + x1 + " " + y1 + " L " + dx1 + " " + dy1 + " L " + dx2 + " " + dy2 + " L " + dx3 + " " + dy3;
                                    }
                                } else {
                                    var leftHand = d.source.x < d.target.x;
                                    if (leftHand) {
                                        return "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
                                    } else {
                                        return "M " + x2 + " " + y2 + " L " + x1 + " " + y1;
                                    }
                                }
                            }
                        });

                        node.attr("transform", function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    })
                    .on("dragend", function (d, i) {
                        d.fixed = true;
                        d3.event.sourceEvent.stopPropagation();
                    });

                var vis = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .call(zoom);

                //删除zoom事件监听器
                vis.on("dblclick.zoom", null);

                var rect = vis.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", "none")
                    .style("pointer-events", "all");

                var topoContainer = vis.append("g");

                var node = topoContainer.selectAll(".roomNode");
                var link = topoContainer.selectAll(".roomLink");
                var pathLabel = topoContainer.selectAll(".roomPath_label");


                scope.$watch('siteMapData', function (newValue) {
                    if (!newValue) {
                        return;
                    }

                    topoContainer.selectAll('*').remove();

                    node = topoContainer.selectAll(".roomNode");
                    link = topoContainer.selectAll(".roomLink");
                    pathLabel = topoContainer.selectAll(".roomPath_label");

                    var links = [];
                    newValue.links.forEach(function (link) {
                        links.push(link);
                        if (link.subLinks.length > 1) {
                            link.subLinks.forEach(function (subLink) {
                                links.push({
                                    source: link.source,
                                    target: link.target,
                                    linkNo: subLink.linkNo,
                                    total: link.subLinks.length,
                                    circuit: subLink
                                })
                            });
                        }
                    });
                    link = link.data(links);
                    link.enter()
                        .append("path")
                        .attr("id", function (d) {
                            if (d.subLinks) {//机房
                                return d.source.id + "_" + d.target.id;
                            } else {//电路
                                return d.source.id + "_" + d.target.id + "_" + d.circuit.no;
                            }
                        })
                        .attr("class", function (l) {
                            var classValue = "roomLink";
                            if (l.linkNo) {
                                classValue += " hide";
                            }
                            return classValue;

                        })
                        .style("fill", "none")
                        .style("stroke", function (d) {
                            var hasFault = false;
                            if (d.subLinks) {
                                d.subLinks.forEach(function (subLink) {
                                    if (subLink.hasFault) {
                                        hasFault = true;
                                    }
                                });
                            } else if (d.circuit.hasFault) {
                                hasFault = true;
                            }
                            if (hasFault) {
                                return "red";
                            } else {
                                return "#585858";
                            }
                        })
                        .style("stroke-width", 2)
                        .attr("marker-end", function (d) {
                            return "url(#" + d.value + ")";
                        })
                        .on('click', function (d) {
                            var id = "";
                            if (d.linkNo) {//单条电路
                                id = d.source.id + "_" + d.target.id + "_" + d.circuit.no;
                            } else {
                                id = d.source.id + "_" + d.target.id;
                            }
                            var clickCircuits = [];
                            var isSelected = topoContainer.select('path[id="' + id + '"]').classed("selected");
                            if (isSelected) {
                                topoContainer.select('path[id="' + id + '"]')
                                    .classed("selected", false)
                                    .style("stroke", function (d) {
                                        var hasFault = false;
                                        if (d.subLinks) {
                                            d.subLinks.forEach(function (subLink) {
                                                if (subLink.hasFault) {
                                                    hasFault = true;
                                                }
                                            });
                                        } else if (d.circuit.hasFault) {
                                            hasFault = true;
                                        }
                                        if (hasFault) {
                                            return "red";
                                        } else {
                                            return "#585858";
                                        }
                                    });
                            } else {
                                topoContainer.selectAll('.roomLink.selected')
                                    .style("stroke", function (d) {
                                        var hasFault = false;
                                        if (d.subLinks) {
                                            d.subLinks.forEach(function (subLink) {
                                                if (subLink.hasFault) {
                                                    hasFault = true;
                                                }
                                            });
                                        } else if (d.circuit.hasFault) {
                                            hasFault = true;
                                        }
                                        if (hasFault) {
                                            return "red";
                                        } else {
                                            return "#585858";
                                        }
                                    });
                                topoContainer.select('path[id="' + id + '"]')
                                    .classed("selected", true)
                                    .style("stroke", function (d) {
                                        return "blue";
                                    });
                                if (d.linkNo) {//单条电路
                                    clickCircuits.push(d.circuit.no);
                                } else {
                                    d.subLinks.forEach(function (subLink) {
                                        clickCircuits.push(subLink.no);
                                    });
                                }
                            }
                            scope.$apply(function () {
                                scope.clickLinkCircuits = clickCircuits.join(',');
                            });
                        })
                        .on('dblclick', function (d) {
                            if (d.linkNo) {//单条电路
                                var parentId = d.source.id + "_" + d.target.id;
                                topoContainer.select('path[id="' + parentId + '"]')
                                    .classed("hide", false);
                                topoContainer.select('text[id="' + parentId + '"]')
                                    .classed("hide", false);
                                var parentLink = null;
                                links.forEach(function (link) {
                                    if (link.subLinks
                                        && link.source.id === d.source.id
                                        && link.target.id === d.target.id) {
                                        parentLink = link;
                                    }
                                });
                                parentLink.subLinks.forEach(function (subLink) {
                                    var linkId = d.source.id + "_" + d.target.id + "_" + subLink.no;
                                    topoContainer.select('path[id="' + linkId + '"]')
                                        .classed("hide", true);
                                    topoContainer.select('text[id="' + linkId + '"]')
                                        .classed("hide", true);
                                });
                            } else if (d.subLinks.length > 1) {//如果有多个电路
                                var parentId = d.source.id + "_" + d.target.id;
                                topoContainer.select('path[id="' + parentId + '"]')
                                    .classed("hide", true);
                                topoContainer.select('text[id="' + parentId + '"]')
                                    .classed("hide", true);
                                d.subLinks.forEach(function (subLink) {
                                    var linkId = d.source.id + "_" + d.target.id + "_" + subLink.no;
                                    topoContainer.select('path[id="' + linkId + '"]')
                                        .classed("hide", false);
                                    topoContainer.select('text[id="' + linkId + '"]')
                                        .classed("hide", false);
                                });
                            }
                            scope.$apply(function () {
                                scope.clickLinkCircuits = [];
                            });
                        });
                    link.exit().remove();

                    pathLabel = pathLabel.data(links);
                    pathLabel.enter().append("svg:text")
                        .attr("id", function (d) {
                            if (d.subLinks) {//机房
                                return d.source.id + "_" + d.target.id;
                            } else {//电路
                                return d.source.id + "_" + d.target.id + "_" + d.circuit.no;
                            }
                        })
                        .attr("class", function (d) {
                            var classValue = "roomPath_label";
                            if (d.linkNo) {
                                classValue += " hide";
                            }
                            return classValue;
                        })
                        .attr("x", 6)
                        .attr("dy", 15)
                        .append("svg:textPath")
                        .attr("startOffset", "50%")
                        .attr("text-anchor", "middle")
                        .attr("xlink:href", function (d) {
                            if (d.subLinks) {//机房
                                return "#" + d.source.id + "_" + d.target.id;
                            } else {//电路
                                return "#" + d.source.id + "_" + d.target.id + "_" + d.circuit.no;
                            }
                        })
                        .style("fill", "#000")
                        .style("font-family", "Arial")
                        .text(function (d) {
                            if (d.subLinks && d.subLinks.length === 1) {//机房只有一条电路
                                return d.subLinks[0].no;
                            } else if (d.subLinks && d.subLinks.length > 1) {//机房有多条电路
                                return "[ " + d.subLinks.length + " ]";
                            } else if (!d.subLinks) {//电路
                                return d.circuit.no;
                            }
                        });
                    pathLabel.exit().remove();

                    node = node.data(newValue.nodes);
                    node.enter()
                        .append("g")
                        .attr("class", "roomNode")
                        .call(node_drag);

                    node.append("svg:image")
                        .attr("xlink:href", function (n) {
                            if (n.type === 'room') {
                                return "assets/img/house.png";
                            } else if (n.type === 'me') {
                                return "assets/img/transmission.png";
                            }
                        })
                        .attr("x", -16)
                        .attr("y", -16)
                        .attr("width", 32)
                        .attr("height", 32);

                    node.append("text")
                        .attr("dx", 22)
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return d.name
                        });
                    node.exit().remove();


                    force.nodes(newValue.nodes)
                        .links(newValue.links)
                        .start();
                });
            }
        }
    });