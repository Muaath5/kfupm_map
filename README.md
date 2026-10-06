# KFUPM Campus Map Starter

A no-build, no-server campus map made with plain HTML, CSS, JavaScript, Leaflet,
GeoJSON, and JSON. It can be published directly with GitHub Pages.

## Important

All included coordinates, boundaries, places, and paths are **demonstration
data**. Replace them with verified data before presenting the website as an
accurate KFUPM map.

## Run locally

Opening `index.html` directly will not reliably load the JSON files because
browsers restrict `file://` requests. From the project directory, run any small
static server, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

There is no server component in the deployed website. The command above is only
for local previewing.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload the **contents** of this folder so `index.html` is at the repository
   root.
3. Commit the files to the `main` branch.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.
7. Wait for GitHub to show the published URL.

No GitHub Actions, npm, Vite, or compilation is required.

## Data files

### `data/regions.geojson`

Contains campus and neighborhood polygons.

Important properties:

- `id`: permanent unique identifier.
- `parentId`: parent region ID, or `null` for the campus.
- `level`: `0` for campus, `1` for a neighborhood, `2` for a region inside a
  neighborhood.
- `renderOrder`: visual drawing order.
- `arName` and `enName`: bilingual names.

### `data/places.geojson`

Contains buildings, housing, grass fields, parking, services, and other places.

Important properties:

- `id`: permanent unique identifier.
- `number`: building number, when applicable.
- `arName` and `enName`: bilingual names.
- `aliases`: other search terms.
- `category`: controls filtering and color.
- `regionId`: the containing region.
- `entranceNodeIds`: routing nodes belonging to the place's entrances.
- `details`: any additional fields specific to that type of place.

Available starter colors are defined in `CONFIG.placeColors` near the top of
`app.js`. Add a category there when you want a new color.

### `data/network.json`

Contains routing nodes and edges. The starter only displays the network; it
does not yet calculate routes.

- A node is a geographic point such as an entrance or intersection.
- An edge connects exactly two nodes.
- `geometry` contains the line's coordinates and may include intermediate
  points for curves.
- `bidirectional` indicates whether users may walk both ways.
- `details` stores accessibility, stairs, surface, shade, or similar data.

## Coordinate rules

GeoJSON coordinates are always written as:

```text
[longitude, latitude]
```

A polygon uses an extra level of arrays, and its first and last points must be
identical:

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [50.1, 26.1],
      [50.2, 26.1],
      [50.2, 26.2],
      [50.1, 26.1]
    ]
  ]
}
```

## Editing geometry

The easiest workflow is:

1. Open a GeoJSON editor such as geojson.io or use QGIS.
2. Draw or edit polygons and paths.
3. Export GeoJSON.
4. Copy the verified features into `regions.geojson` or `places.geojson`.
5. Validate the JSON before committing.

Do not trace copyrighted satellite imagery unless its licence explicitly allows
derivative datasets.

## Images

Put images in an `images/` folder and add paths inside a place's properties:

```json
"images": [
  "images/building-22/front.webp",
  "images/building-22/entrance.webp"
]
```

The starter does not display galleries yet, but the data format is ready for
that feature.

## Attribution and map tiles

The starter uses OpenStreetMap's public tile server and preserves the required
attribution. This is suitable for development and a small student project. If
the website receives substantial traffic, move to a dedicated tile provider
and follow that provider's terms.
