angular.module('netcareApp')
    .directive('bizStatusTopo', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var width = element[0].offsetWidth,
                    height = element[0].offsetHeight,
                    charge = element[0].offsetWidth > 768? -1500: -1000;
                var color = d3.scale.category20();

                var vis = d3.select(element[0])
                    .append("svg")
                    .attr("width",width)
                    .attr("height", height);

                scope.$watch('bizStatusTopoDatas', function (newValue) {

                    vis.selectAll('*').remove();

                    if(!newValue){
                        return;
                    }

                    var force = d3.layout.force()
                        .charge([charge])
                        .linkDistance([250])
                        .gravity(0.3)
                        .size([width, height])
                        .nodes(newValue.nodes)
                        .links(newValue.links);

                    var edges = vis.selectAll("line")
                        .data(newValue.links)
                        .enter()
                        .append("path")
                        .attr("id", function(d) { return d.source.id + "_" + d.target.id; })
                        .style("fill", "none")
                        .style("stroke", "#585858")
                        .style("stroke-width", 1)
                        .attr("marker-end", function(d) { return "url(#" + d.value + ")"; });

                    var path_label = vis.append("svg:g").selectAll(".path_label")
                        .data(force.links())
                        .enter().append("svg:text")
                        .attr("class", "path_label")
                        .attr("dy", -10)
                        .append("svg:textPath")
                        .attr("startOffset", "50%")
                        .attr("text-anchor", "middle")
                        .attr("xlink:href", function(d) { return "#" + d.source.id + "_" + d.target.id; })
                        .style("fill", "#000")
                        .style("font-family", "Arial")
                        .text(function(d) { return d.value; });

                    var nodes = vis.selectAll("node")
                        .data(newValue.nodes)
                        .enter()
                        .append("g")
                        .attr("class", "node")
                        .call(force.drag);

                    nodes.append("svg:image")
                        .attr("xlink:href", function(n){
                            return "assets/img/house.png";
                        })
                        .attr("x", -16)
                        .attr("y", -16)
                        .attr("width", 32)
                        .attr("height", 32);

                    nodes.append("text")
                        .attr("dx", 22)
                        .attr("dy", ".35em")
                        .text(function(d) { return d.name });

                    force.on("tick", function() {
                        edges.attr("d", function(d) {
                            // Self edge.
                            var x1 = d.source.x,
                                y1 = d.source.y,
                                x2 = d.target.x,
                                y2 = d.target.y;
                            if ( x1 === x2 && y1 === y2 ) {
                                var dx1= x1-40,
                                    dy1= y1-40,
                                    dx2= dx1+80,
                                    dy2= dy1,
                                    dx3= x1,
                                    dy3= y1;

                                return "M " + x1 + " " + y1 + " L " + dx1 + " " + dy1+ " L " + dx2 + " " + dy2+ " L " + dx3 + " " + dy3;
                            }else{
                                var leftHand = d.source.x < d.target.x;
                                if(leftHand){
                                    return "M " + x1 + " " + y1 + " L " + x2 + " " + y2;
                                }else{
                                    return "M " + x2 + " " + y2 + " L " + x1 + " " + y1;
                                }
                            }
                        });

                        nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                    });
                    force.start();
                });
            }
        }
    });