import React, { useEffect, memo } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

const style={height: "93vh", width: "100%", backgroundColor: "#00A8E8"};

interface GraphPanelProps {
    data: any,
    toggleReport: (id: string) => void,
};

const GraphPanel = (props: GraphPanelProps) => {
    useEffect(() => {
        // Include chart code here
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create map instance
        const chart = am4core.create("chartdiv", am4maps.MapChart);

        // Set map definition
        chart.geodata = am4geodata_worldLow;

        chart.chartContainer.wheelable = false;

        // Set projection
        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series
        const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Exclude Antartica
        polygonSeries.exclude = ["AQ"];

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        // Configure series
        const polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.polygon.fillOpacity = 0.6;
        polygonTemplate.fill = am4core.color('#003459');


        // Create hover state and set alternative fill color
        const hs = polygonTemplate.states.create("hover");
        hs.properties.fill = chart.colors.getIndex(0);

        // Add image series
        const imageSeries = chart.series.push(new am4maps.MapImageSeries());
        imageSeries.mapImages.template.propertyFields.longitude = "longitude";
        imageSeries.mapImages.template.propertyFields.latitude = "latitude";
        // imageSeries.mapImages.template.tooltipText = "{title}";
        imageSeries.mapImages.template.tooltipHTML = "<h1>{title}<h1><button>Hello</button>";
        const tooltip = imageSeries.mapImages.template.tooltip;
        imageSeries.mapImages.template.propertyFields.url = "url";
        // imageSeries.mapImages.template.propertyFields.id = "id";

        const circle = imageSeries.mapImages.template.createChild(am4core.Circle);
        circle.radius = 5;
        circle.propertyFields.fill = "color";
        circle.propertyFields.id = "id";

        circle.events.on('hit', (event) => {
            console.log(event);
            const id = event.target.propertyFields.id || "";
            props.toggleReport(id); 

            tooltip != null && tooltip.showTooltip();
        });

        // imageSeries.data = imageData;
        imageSeries.data = props.data.articles && props.data.articles.map((article) => {
            circle.propertyFields.id = article._id;
            const coords = article.reports[0].locations[0].coords;
            const [lat, long] = coords.split(", ");
            return {
                "title": article.headline,
                "latitude": Number(lat),
                "longitude": Number(long), 
                "url": `#${article._id}`,
                "id": article._id,
            };
        });

        return function cleanup() {
            chart.dispose(); 
        };
    });

    return <div id="chartdiv" style={style}></div>;
}

const shouldUpdate = (prevprops, nextprops) => {
    return prevprops.data.version === nextprops.data.version;
  }

export default memo(GraphPanel, shouldUpdate);