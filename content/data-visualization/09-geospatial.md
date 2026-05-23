---
title: Geospatial Visualization
skill: data-visualization
order: 9
quiz:
  - type: mc
    question: "What is a choropleth map?"
    options:
      - "A map that shows roads and highways"
      - "A map where geographic regions are colored based on a data variable"
      - "A 3D terrain map"
      - "A map showing only point locations"
    answer: 1
  - type: mc
    question: "What does GeoPandas add to the Python data science ecosystem?"
    options:
      - "Support for time series analysis"
      - "Geometric operations and spatial joins on DataFrame-like objects"
      - "Machine learning algorithms"
      - "Web scraping capabilities"
    answer: 1
  - type: mc
    question: "What is the purpose of a geographic coordinate system?"
    options:
      - "To measure time zones"
      - "To define locations on Earth using latitude and longitude"
      - "To calculate population density"
      - "To create map legends"
    answer: 1
---

> **🎮 Analogy:** Geospatial visualization is the world map in The Elder Scrolls — except instead of marking dungeon locations, you're plotting sales regions, and instead of fast-traveling, you're zooming from continent to continent with Plotly.

## Choropleth Maps

Choropleth maps color geographic regions based on a data variable:

> **🎮 Analogy:** A choropleth map is the faction influence overlay in a strategy game — painting each country (or territory) based on a metric (GDP, population, happiness) is exactly like seeing which regions are "Empire-controlled" (high values) vs "Rebel-sympathizing" (low values), with a color gradient showing the intensity of control.

```python

```python
import plotly.express as px

df = px.data.gapminder().query("year == 2007")

fig = px.choropleth(df,
                    locations="iso_alpha",
                    color="lifeExp",
                    hover_name="country",
                    color_continuous_scale=px.colors.sequential.Plasma,
                    title="Life Expectancy by Country (2007)")

fig.update_layout(geo=dict(showframe=False, showcoastlines=True))
fig.show()
```

> **🎮 Analogy:** The color scale on a choropleth is like the heat map of player deaths in a battle royale — the darker the region, the more players died there (higher metric value). You can instantly spot the hotspots (popular drop zones) without counting individual death markers.

## GeoPandas Basics

GeoPandas extends pandas with geometric operations:

> **🎮 Analogy:** GeoPandas is the map editor in a modding toolkit — regular pandas is a spreadsheet of coordinates (which is useless on its own), but GeoPandas knows that those coordinates form borders, connections, and shapes, turning raw latitude/longitude data into actual map geometry you can plot and analyze.

```python
import geopandas as gpd
import matplotlib.pyplot as plt

world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

fig, ax = plt.subplots(1, 1, figsize=(15, 8))
world.plot(column='pop_est',
           ax=ax,
           legend=True,
           cmap='viridis',
           edgecolor='black',
           linewidth=0.3,
           legend_kwds={'label': 'Population Estimate',
                        'shrink': 0.6})

ax.set_title('World Population Estimates', fontsize=16)
ax.set_axis_off()
plt.show()
```

> **🎮 Analogy:** GeoPandas' `.plot()` method is like the auto-map feature in a game — give it a GeoDataFrame and it draws the continent outlines, fills them with your data, and adds a legend, all without you manually drawing coastlines like some cartographer NPC.

## Plotly Express with Mapbox

> **🎮 Analogy:** Mapbox integration in Plotly is like switching from a paper map to Google Maps in an open-world game — instead of a static, pre-rendered map, you get a zoomable, pannable, tile-loaded world map where data points appear as interactive markers with pop-up information windows.

Plotly integrates with Mapbox for interactive maps:

```python
import plotly.express as px
import pandas as pd

df = pd.DataFrame({
    "city": ["London", "Paris", "Berlin", "Madrid", "Rome"],
    "lat": [51.5074, 48.8566, 52.5200, 40.4168, 41.9028],
    "lon": [-0.1278, 2.3522, 13.4050, -3.7038, 12.4964],
    "population": [8982000, 2161000, 3645000, 3223000, 2873000],
})

fig = px.scatter_mapbox(df,
                        lat="lat",
                        lon="lon",
                        size="population",
                        color="population",
                        hover_name="city",
                        zoom=3,
                        mapbox_style="open-street-map",
                        title="European City Populations")

fig.show()
```

> **🎮 Analogy:** The scatter_mapbox with bubble-sized populations is the Civilization "city population" map overlay — each city is a circle, bigger circles mean more citizens, and the colors tell you which civilization (category) owns them. Hovering reveals the full city-state information panel.

## Geographic Coordinate Systems

Understanding coordinate systems prevents distorted maps:

> **🎮 Analogy:** Coordinate Reference Systems are like the map projection settings in a game's world map — WGS84 (lat/lon) is the flat paper map in your inventory, Web Mercator is the in-game GPS that accounts for the planet being round, and UTM zones are the local region maps that don't distort distances. Use the wrong one and Greenland looks bigger than Africa, which is a very misleading map indeed.

```python
def explain_crs():
    systems = {
        "WGS 84 (EPSG:4326)": "Lat/Lon coordinates, used by GPS",
        "Web Mercator (EPSG:3857)": "Projected, used by Google Maps/OpenStreetMap",
        "UTM zones": "Projected, preserves distances within a zone",
        "Albers Equal-Area": "Projected, preserves area comparisons",
    }

    print("Common Coordinate Reference Systems:\n")
    for name, desc in systems.items():
        print(f"  {name:<35s} {desc}")

    print("\nAlways check your data's CRS before plotting!")
    print("Use .to_crs() in GeoPandas to reproject.")

explain_crs()
```

**Output:**
```
Common Coordinate Reference Systems:

  WGS 84 (EPSG:4326)              Lat/Lon coordinates, used by GPS
  Web Mercator (EPSG:3857)        Projected, used by Google Maps/OpenStreetMap
  UTM zones                       Projected, preserves distances within a zone
  Albers Equal-Area               Projected, preserves area comparisons

Always check your data's CRS before plotting!
Use .to_crs() in GeoPandas to reproject.
```