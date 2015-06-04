angular.module('netcareApp')
    .directive('circuitTopo', function () {
        return {
            restrict: 'A',
            scope: {
                routeData: '=',
                showText: '=',
                circuit: '='
            },
            link: function (scope, element) {
                var width = element[0].offsetWidth,
                    height = element[0].offsetHeight,
                    charge = element[0].offsetWidth > 768 ? -6000 : -1200;

                var force = d3.layout.force()
                    .charge([charge])
                    .linkDistance(200)
                    .gravity(0.3)
                    .size([width, height]);

                force.on("tick", function () {
                    link.attr("d", function (d) {
                        if (d.linkNo) {
                            var source_x = d.source.x,
                                source_y = d.source.y,
                                target_x = d.target.x,
                                target_y = d.target.y;
                            var maxAngle = 150;
                            var minPerAngle = 25;
                            var expandDistance = 40;
                            var total = d.total;
                            var index = d.linkNo;

                            if (minPerAngle*(total-1)<maxAngle) {
                                maxAngle=minPerAngle*(total-1);
                            }

                            var distanceBetweenAZ=Math.pow((target_x-source_x)*(target_x-source_x)
                            + (target_y-source_y)*(target_y-source_y),0.5);
                            if (distanceBetweenAZ<2*expandDistance) {
                                expandDistance=distanceBetweenAZ/2;
                            }
                            var tan=(target_y-source_y)/(target_x-source_x);
                            var sin=(target_y-source_y>=0?1:-1)*Math.abs(Math.sin(Math.atan(tan)));
                            var cos=(target_x-source_x>=0?1:-1)*Math.cos(Math.atan(tan));
                            var staightDistance=Math.tan(maxAngle/2*Math.PI/180)*expandDistance*2;
                            var bassXFrom=source_x+cos*expandDistance-sin*staightDistance/2;
                            var bassYFrom=source_y+sin*expandDistance+cos*staightDistance/2;
                            var stepX=staightDistance*sin/(total-1);
                            var stepY=staightDistance*cos/(total-1);
                            var xFrom=bassXFrom+(index-1)*stepX;
                            var yFrom=bassYFrom-(index-1)*stepY;

                            var bassXTo=target_x-cos*expandDistance-sin*staightDistance/2;
                            var bassYTo=target_y-sin*expandDistance+cos*staightDistance/2;

                            var xTo=bassXTo+(index-1)*stepX;
                            var yTo=bassYTo-(index-1)*stepY;

                            return "M " + source_x + " " + source_y
                                + " L " + xFrom + " " + yFrom
                                + " L " + xTo + " " + yTo
                                + " L " + target_x + " " + target_y;

                        } else {
                            return "M" +
                                d.source.x + "," +
                                d.source.y + "L" +
                                d.target.x + "," +
                                d.target.y;
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
                            if (d.linkNo) {
                                var source_x = d.source.x,
                                    source_y = d.source.y,
                                    target_x = d.target.x,
                                    target_y = d.target.y;
                                var maxAngle = 150;
                                var minPerAngle = 25;
                                var expandDistance = 40;
                                var total = d.total;
                                var index = d.linkNo;

                                if (minPerAngle*(total-1)<maxAngle) {
                                    maxAngle=minPerAngle*(total-1);
                                }

                                var distanceBetweenAZ=Math.pow((target_x-source_x)*(target_x-source_x)
                                + (target_y-source_y)*(target_y-source_y),0.5);
                                if (distanceBetweenAZ<2*expandDistance) {
                                    expandDistance=distanceBetweenAZ/2;
                                }
                                var tan=(target_y-source_y)/(target_x-source_x);
                                var sin=(target_y-source_y>=0?1:-1)*Math.abs(Math.sin(Math.atan(tan)));
                                var cos=(target_x-source_x>=0?1:-1)*Math.cos(Math.atan(tan));
                                var staightDistance=Math.tan(maxAngle/2*Math.PI/180)*expandDistance*2;
                                var bassXFrom=source_x+cos*expandDistance-sin*staightDistance/2;
                                var bassYFrom=source_y+sin*expandDistance+cos*staightDistance/2;
                                var stepX=staightDistance*sin/(total-1);
                                var stepY=staightDistance*cos/(total-1);
                                var xFrom=bassXFrom+(index-1)*stepX;
                                var yFrom=bassYFrom-(index-1)*stepY;

                                var bassXTo=target_x-cos*expandDistance-sin*staightDistance/2;
                                var bassYTo=target_y-sin*expandDistance+cos*staightDistance/2;

                                var xTo=bassXTo+(index-1)*stepX;
                                var yTo=bassYTo-(index-1)*stepY;

                                return "M " + source_x + " " + source_y
                                    + " L " + xFrom + " " + yFrom
                                    + " L " + xTo + " " + yTo
                                    + " L " + target_x + " " + target_y;
                            } else {
                                return "M" +
                                    d.source.x + "," +
                                    d.source.y + "L" +
                                    d.target.x + "," +
                                    d.target.y;
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

                var node = topoContainer.selectAll(".circuitNode");
                var link = topoContainer.selectAll(".circuitLink");
                var pathLabel = topoContainer.selectAll(".circuitPath_label");


                scope.$watch('routeData', function (newValue) {

                    topoContainer.selectAll('*').remove();

                    if (!newValue || !newValue.channels) {
                        return;
                    }

                    var routeData = newValue;

                    node = topoContainer.selectAll(".circuitNode");
                    link = topoContainer.selectAll(".circuitLink");
                    pathLabel = topoContainer.selectAll(".circuitPath_label");

                    var links = [];
                    var nodes = [];
                    var nodesObj = {};

                    routeData.channels.forEach(function (channel) {
                        var id = channel.aend.meid + "~" + channel.zend.meid;
                        var otherId = channel.zend.meid + "~" + channel.aend.meid;
                        var parentLink;
                        //首先找到父link(channel是父link的孩子)
                        links.forEach(function (l) {
                            var lId = l.source.meid + "~" + l.target.meid;
                            if (id === lId || otherId === lId) {
                                parentLink = l;
                                return;
                            }
                        });
                        //如果父link为空，生成新的link
                        if (!parentLink) {
                            var linkObj = {};
                            links.push(linkObj);
                            if(!nodesObj[channel.aend.meid]){
                                nodesObj[channel.aend.meid] = channel.aend;
                                nodes.push(nodesObj[channel.aend.meid]);
                            }
                            linkObj.source = nodesObj[channel.aend.meid];
                            if(!nodesObj[channel.zend.meid]){
                                nodesObj[channel.zend.meid] = channel.zend;
                                nodes.push(nodesObj[channel.zend.meid]);
                            }
                            linkObj.target = nodesObj[channel.zend.meid];

                            linkObj.id = id;
                            linkObj.subLinks = [];
                            linkObj.subLinks.push({
                                id: id + "~" + (linkObj.subLinks.length + 1),
                                linkNo: linkObj.subLinks.length + 1,
                                parentId: linkObj.id,
                                source: linkObj.source,
                                target: linkObj.target,
                                text: channel.text,
                                type: channel.type,
                                isBack: channel.isBack
                            });
                        } else {
                            parentLink.subLinks.push({
                                id: id + "~" + (parentLink.subLinks.length + 1),
                                linkNo: parentLink.subLinks.length + 1,
                                parentId: parentLink.id,
                                source: nodesObj[channel.aend.meid],
                                target: nodesObj[channel.zend.meid],
                                text: channel.text,
                                type: channel.type,
                                isBack: channel.isBack
                            });
                        }
                    });

                    links.forEach(function (link) {
                        var childLinkNum = link.subLinks.length;
                        if(childLinkNum >1){
                            link.subLinks.forEach(function (subLink) {
                                subLink.total = childLinkNum;
                                links.push(subLink)
                            });
                        }
                    });

                    link = link.data(links);
                    link.enter()
                        .append("path")
                        .attr("id", function (l) {
                            return l.id;
                        })
                        .attr("class", function (l) {
                            var classValue = "circuitLink";
                            if (l.isBack) {
                                classValue += " back";
                            }
                            if (l.type === 1) {
                                classValue += " ddf";
                            }
                            if (l.linkNo) {
                                classValue += " hide";
                            }
                            return classValue;
                        })
                        .style("fill", "none")
                        .style("stroke", function (d) {
                            return "#585858";
                        })
                        .style("stroke-width", 2)
                        .on('dblclick', function (l) {
                            if (l.linkNo) {//单条channel
                                topoContainer.select('path[id="' + l.parentId + '"]')
                                    .classed("hide", false);
                                topoContainer.select('text[id="' + l.parentId + '"]')
                                    .classed("hide", false);
                                var parentLink = null;
                                links.forEach(function (link) {
                                    if (link.id === l.parentId) {
                                        parentLink = link;
                                        return;
                                    }
                                });
                                parentLink.subLinks.forEach(function (subLink) {
                                    topoContainer.select('path[id="' + subLink.id + '"]')
                                        .classed("hide", true);
                                    topoContainer.select('text[id="' + subLink.id + '"]')
                                        .classed("hide", true);
                                });
                            } else if (l.subLinks.length > 1) {//如果有多个channel
                                topoContainer.select('path[id="' + l.id + '"]')
                                    .classed("hide", true);
                                topoContainer.select('text[id="' + l.id + '"]')
                                    .classed("hide", true);
                                l.subLinks.forEach(function (subLink) {
                                    topoContainer.select('path[id="' + subLink.id + '"]')
                                        .classed("hide", false);
                                    topoContainer.select('text[id="' + subLink.id + '"]')
                                        .classed("hide", false);

                                });
                            }
                        });
                    link.exit().remove();

                    pathLabel = pathLabel.data(links);
                    pathLabel.enter().append("svg:text")
                        .attr("id", function (l) {
                            return l.id
                        })
                        .attr("class", function (l) {
                            var classValue = "circuitPath_label";
                            if (!l.subLinks ||(l.subLinks && l.subLinks.length ===1)) {
                                classValue += " hide";
                            }
                            return classValue;
                        })
                        .attr("x", 6)
                        .attr("dy", 15)
                        .append("svg:textPath")
                        .attr("startOffset", "50%")
                        .attr("text-anchor", "middle")
                        .attr("xlink:href", function (l) {
                            return "#" + l.id;
                        })
                        .style("fill", "#000")
                        .style("font-family", "Arial")
                        .text(function (l) {
                            if (l.subLinks && l.subLinks.length === 1) {//只有一条channel
                                return l.subLinks[0].text;
                            } else if (l.subLinks && l.subLinks.length > 1) {
                                return "[ " + l.subLinks.length + " ]";
                            } else if (!l.subLinks) {
                                return l.text;
                            }
                        });
                    pathLabel.exit().remove();

                    node = node.data(nodes);
                    node.enter()
                        .append("g")
                        .attr("class", "roomNode")
                        .call(node_drag);

                    node.append("svg:image")
                        .attr("xlink:href", function (n) {
                            var hasFault  = routeData.faultMes.indexOf(n.meid) !== -1?true:false;
                            if (n.deviceType === '传输') {
                                if(hasFault){
                                    return "assets/img/transmission-fault.png";
                                }else{
                                    return "assets/img/transmission.png";
                                }
                            } else if (n.deviceType === '交换') {
                                if(hasFault){
                                    return "assets/img/switch-fault.png";
                                }else{
                                    return "assets/img/switch.png";
                                }
                            } else if (n.deviceType === '数据') {
                                if(hasFault){
                                    return "assets/img/ip-fault.png";
                                }else{
                                    return "assets/img/ip.png";
                                }
                            } else if (n.deviceType === '接入') {
                                if(hasFault){
                                    return "assets/img/ip-fault.png";
                                }else{
                                    return "assets/img/ip.png";
                                }
                            } else {
                                return "assets/img/unknow.png";
                            }
                        })
                        .attr("x", -16)
                        .attr("y", -16)
                        .attr("width", 32)
                        .attr("height", 32)
                        .on("click",function(n){
                            var html = ''
                                +'<div class="meinfo-row-detail-row">'
                                +'<div class="meinfo-row-detail-name">设备类型:'
                                +'</div>'
                                +'<div class="meinfo-row-detail-value">'+n.deviceType
                                +'</div>'
                                +'</div>';
                            if(n.meid === routeData.ameid){
                                html+= '<div class="meinfo-row-detail-row">'
                                +'<div class="meinfo-row-detail-name">端口名称:'
                                +'</div>'
                                +'<div class="meinfo-row-detail-value">'+scope.circuit.aPort
                                +'</div>'
                                +'</div><!-- ./me info detail row -->';
                            }else if(n.meid === routeData.zmeid){
                                html+= '<div class="meinfo-row-detail-row">'
                                +'<div class="meinfo-row-detail-name">端口名称:'
                                +'</div>'
                                +'<div class="meinfo-row-detail-value">'+scope.circuit.zPort
                                +'</div>'
                                +'</div>'
                            }

                            if (d3.event.defaultPrevented){
                                return;
                            }
                            if(d3.select(this).classed('pop')) {
                                $(this)
                                    .popover('hide');
                                d3.select(this).classed('pop',false);
                            } else{
                                $(this).popover({
                                    trigger: 'manual',
                                    title: n.mename,
                                    container: 'body',
                                    placement: 'top',
                                    html: true,
                                    content: html
                                })
                                    .popover('show');
                                d3.select(this).classed('pop',true);
                            }
                        });

                    node.append("text")
                        .attr("dx", 22)
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return d.mename
                        });

                    node.append("text")
                        .style("font-size", "13px")
                        .style("fill", "red")
                        .attr("dx", "-20")
                        .attr("dy", "-20")
                        .text(function (d) {
                            if (d.meid === routeData.ameid) {
                                return "A端";
                            } else if (d.meid === routeData.zmeid) {
                                return "Z端";
                            }
                        });

                    node.exit().remove();


                    force.nodes(nodes)
                        .links(links)
                        .start();
                });

                scope.$watch('showText', function (newValue) {
                    var links = force.links();
                    links.forEach(function (link) {
                        if(link.subLinks && link.subLinks.length === 1){
                            topoContainer.select('text[id="' + link.id + '"]')
                                .classed("hide", newValue);
                        }
                    });

                });
            }
        }
    });