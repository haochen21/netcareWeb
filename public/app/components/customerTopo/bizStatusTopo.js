angular.module('netcareApp')
    .directive('bizStatusTopo', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var width = element[0].offsetWidth
                    height = element[0].offsetHeight;
                var color = d3.scale.category20();

                var vis = d3.select(element[0])
                    .append("svg")
                    .attr("width",width)
                    .attr("height", height);

                scope.$watch('bizStatusTopoDatas', function (topoDatas) {

                    vis.selectAll('*').remove();

                    if(!topoDatas){
                        return;
                    }

                    var force = d3.layout.force()
                        .charge([-1500])
                        .linkDistance([250])
                        .gravity(0.3)
                        .size([width, height])
                        .nodes(topoDatas.nodes)
                        .links(topoDatas.links)
                        .start();

                    var edges = vis.selectAll("line")
                        .data(topoDatas.links)
                        .enter()
                        .append("line")
                        .style("stroke", "#ccc")
                        .style("stroke-width", 1)
                        .attr("marker-end", "url(#end)");

                    var nodes = vis.selectAll("node")
                        .data(topoDatas.nodes)
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
                        edges.attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });
                        nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                    })
                });
            }
        }
    });