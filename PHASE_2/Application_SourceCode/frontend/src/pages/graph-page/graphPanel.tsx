import React, { useEffect } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import config from '../../config';

const style = { height: "81.5vh", width: "100%", backgroundColor: "#FFFFFF" };

interface GraphPanelProps {
    data: any
    totalCases: boolean;
    totalDeaths: boolean;
    newCases: boolean;
    newDeaths: boolean;
    predict: boolean;
    title: string;
};

const GraphPanel = (props: GraphPanelProps) => {
    useEffect(() => {
        if (props.data.seriesTitles.length === 0) {
            return;
        }

        // Themes 
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        let chart = am4core.create("chartdiv", am4charts.XYChart);

        // Create axes
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.tooltipDateFormat = "d MMM yyyy"; // Show the year in the tooltip

        // Add scrollbar
        let scrollbar = new am4charts.XYChartScrollbar();
        scrollbar.height = 100;
        scrollbar.background.fill = am4core.color(config.theme.mediumColor);
        scrollbar.startGrip.background.fill = am4core.color(config.theme.mediumColor);
        scrollbar.endGrip.background.fill = am4core.color(config.theme.mediumColor);
        chart.scrollbarX = scrollbar;
        chart.scrollbarX.parent = chart.bottomAxesContainer; // move it below the chart

        // Create a title. Centered at the top
        let title = chart.titles.create();
        title.text = props.title.toUpperCase();
        title.fontSize = 25;
        title.marginBottom = 30;

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "zoomXY";

        function createAxis(name) {
            let axis = chart.yAxes.push(new am4charts.ValueAxis());
            axis.paddingLeft = 5;
            axis.disabled = true;
            axis.title.text = name;
            axis.min = 1;
            if (chart.yAxes.indexOf(axis) !== 0) {
                axis.syncWithAxis = tCasesAxis;
            }

            // Toggle log scale
            axis.title.events.on("hit", () => {
                axis.logarithmic = !axis.logarithmic
                axis.logarithmic ? axis.title.text = name + " (log scale)" : axis.title.text = name;
            });
            return axis;
        }

        // Create series
        function createSeries(axis, xField, yField, bulletType, colour) {
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = yField;
            series.dataFields.dateX = xField;
            series.strokeWidth = 2;
            series.yAxis = axis;

            series.name = snakeToTitle(yField);
            series.tooltipText = "{name}: {valueY}";
            series.tensionX = 0.9;
            series.showOnInit = true;
            series.fill = colour;
            series.stroke = colour;

            // Maybe remove/show the axis for this series when we toggle this axis
            series.events.on("hidden", toggleAxes);
            series.events.on("shown", toggleAxes);

            // Display the current number in the legend
            //series.legendSettings.valueText = "{valueY.close}";
            scrollbar.series.push(series);

            let interfaceColors = new am4core.InterfaceColorSet();

            // Make the bullets
            let bullet = series.bullets.push(new am4charts.Bullet());
            bullet.width = 12;
            bullet.height = 12;
            bullet.horizontalCenter = "middle";
            bullet.verticalCenter = "middle";

            // Choose a shape
            let shape;
            switch (bulletType) {
                case "triangle":
                    shape = bullet.createChild(am4core.Triangle);
                    break;
                case "rectangle":
                    shape = bullet.createChild(am4core.Rectangle);
                    break;
                case "rrectangle":
                    shape = bullet.createChild(am4core.RoundedRectangle);
                    shape.cornerRadiusBottomLeft = 0;
                    shape.cornerRadiusBottomRight = 35;
                    shape.cornerRadiusTopLeft = 35;
                    shape.cornerRadiusTopRight = 0;
                    break;
                case "rrectangle2":
                    shape = bullet.createChild(am4core.RoundedRectangle);
                    shape.cornerRadiusBottomLeft = 35;
                    shape.cornerRadiusBottomRight = 0;
                    shape.cornerRadiusTopLeft = 0;
                    shape.cornerRadiusTopRight = 35;
                    break;
                case "trapizoid":
                    shape = bullet.createChild(am4core.Trapezoid);
                    shape.topSide = 5;
                    shape.botSide = 3;
                    bullet.rotation = 180;
                    break;
                case "cone":
                    shape = bullet.createChild(am4core.Cone);
                    break;
                default:
                    console.log("error", bulletType);
                    break;
                case "circle":
                    shape = bullet.createChild(am4core.RoundedRectangle);
                    shape.cornerRadiusBottomLeft = 100;
                    shape.cornerRadiusBottomRight = 100;
                    shape.cornerRadiusTopLeft = 100;
                    shape.cornerRadiusTopRight = 100;
                    break;
            }

            shape.stroke = interfaceColors.getFor("background");
            shape.strokeWidth = 2;
            shape.direction = "top";
            shape.width = 12;
            shape.height = 12;

            axis.renderer.line.strokeOpacity = 1;
            axis.renderer.line.strokeWidth = 2;
            axis.renderer.line.stroke = series.stroke;
            axis.renderer.line.align = "right";
            axis.renderer.labels.template.fill = series.stroke;

        }

        // turn the axes off if all it's series are diabled
        function toggleAxes(ev) {
            let axis = ev.target.yAxis;
            let disabled = true;
            axis.series.each(function (series) {
                if (!series.isHiding && !series.isHidden) {
                    disabled = false;
                }
            });
            axis.disabled = disabled;
        }

        let combinedData = [];

        let tCasesAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Total Cases");
        let tDeathsAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Total Deaths");
        let nCasesAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("New Cases");
        let nDeathsAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("New Deaths");
        let googleAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Google Search Terms (Percentage of Peak Traffic)");
        //let twitterAxis: am4charts.ValueAxis<am4charts.AxisRenderer> = createAxis("Twitter"); // We needed an enterprise twitter account
        nCasesAxis.extraMax = 0.8;
        nDeathsAxis.extraMax = 0.8;

        let tCasesColour, tDeathsColour, nCasesColour, nDeathsColour, googleColour, predictionColour;
        const colourSet = new am4core.ColorSet();
        colourSet.step = 3;
        tCasesColour = colourSet.next();
        tDeathsColour = colourSet.next();
        nCasesColour = colourSet.next();
        nDeathsColour = colourSet.next();
        googleColour = colourSet.next();
        predictionColour = colourSet.next();

        const bullets = ["circle", "rectangle", "triangle", "rrectangle", "trapizoid", "rrectangle2", "cone"];

        // Combine all the data and create each series
        for (let i in props.data.seriesTitles) {
            const title = props.data.seriesTitles[i];

            combinedData = combinedData.concat(props.data.graphData[i]);
            const bullet = bullets[+i % bullets.length]; // Choose a bullet

            // Get the predictions data from the end of the data
            for (let seriesName in props.data.graphData[i][props.data.graphData[i].length - 1]) {
                if (seriesName.includes("predict") && props.predict) {
                    if (seriesName.includes("cases") && props.totalCases) {
                        createSeries(tCasesAxis, "pdate_" + title, seriesName, bullet, predictionColour);
                    }
                    if (seriesName.includes("deaths") && props.totalDeaths) {
                        createSeries(tDeathsAxis, "pdate_" + title, seriesName, bullet, predictionColour);
                    }
                }
            }

            // Create each series for each country
            for (let seriesName in props.data.graphData[i][0]) {
                if (seriesName.includes("total_cases") && props.totalCases) {
                    createSeries(tCasesAxis, "date_" + title, seriesName, bullet, tCasesColour);
                }
                if (seriesName.includes("total_deaths") && props.totalDeaths) {
                    createSeries(tDeathsAxis, "date_" + title, seriesName, bullet, tDeathsColour);
                }
                if (seriesName.includes("new_cases") && props.newCases) {
                    createSeries(nCasesAxis, "date_" + title, seriesName, bullet, nCasesColour);
                }
                if (seriesName.includes("new_deaths") && props.newDeaths) {
                    createSeries(nDeathsAxis, "date_" + title, seriesName, bullet, nDeathsColour);
                }
                if (seriesName.includes("google")) {
                    createSeries(googleAxis, "gdate_" + title, seriesName, bullet, googleColour);
                }
            }
        }

        chart.data = combinedData;

        return function cleanup() {
            chart.dispose();
        };
    });

    return <div id="chartdiv" style={style}></div>;
}

function snakeToTitle(string: String) {
    string = string.replace(" ", "_");
    string = string.replace(":", "_");
    let parts = string.split("_");
    let ans: Array<String> = [];
    for (let p of parts) {
        ans.push(p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    }
    return ans.join(" ");
}

export default GraphPanel;