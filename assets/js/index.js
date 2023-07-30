//API
const movieDataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movieData;

//Creacion del svg y tooltip
const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawTreeMap = () => {
  const hierarchy = d3
    .hierarchy(movieData, (node) => {
      return node["children"];
    })
    .sum((node) => {
      return node["value"];
    })
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });

  const createTreeMap = d3.treemap().size([1000, 600]);

  createTreeMap(hierarchy);

  const movieTiles = hierarchy.leaves();
  console.log(movieTiles);

  const block = canvas
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (movie) => {
      return "translate(" + movie["x0"] + ", " + movie["y0"] + ")";
    });

  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      const category = movie["data"]["category"];
      if (category === "Action") {
        return "#01c380";
      } else if (category === "Drama") {
        return "#683ca4";
      } else if (category === "Adventure") {
        return "#10e5b2";
      } else if (category === "Family") {
        return "#342844";
      } else if (category === "Animation") {
        return "#211432";
      } else if (category === "Comedy") {
        return "#4b4059";
      } else if (category === "Biography") {
        return "#34284490";
      }
    })
    .attr("data-name", (movie) => {
      return movie["data"]["name"];
    })
    .attr("data-category", (movie) => {
      return movie["data"]["category"];
    })
    .attr("data-value", (movie) => {
      return movie["data"]["value"];
    })
    .attr("width", (movie) => {
      return movie["x1"] - movie["x0"];
    })
    .attr("height", (movie) => {
      return movie["y1"] - movie["y0"];
    })
    .on("mouseover", (movie) => {
      tooltip.transition().style("visibility", "visible");

      const revenue = movie["data"]["value"]
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      tooltip.html("$ " + revenue + "<hr />" + movie["data"]["name"]);

      tooltip.attr("data-value", movie["data"]["value"]);
    })
    .on("mouseout", (movie) => {
      tooltip.transition().style("visibility", "hidden");
    });

  block
    .append("text")
    .text((movie) => {
      return movie["data"]["name"];
    })
    .attr("x", 5)
    .attr("y", 20)
    .style("color", "#ffffff");
};

d3.json(movieDataUrl).then((data, error) => {
  movieData = data;
  console.log(movieData);
  drawTreeMap();
});
