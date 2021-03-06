
import {MapGenerator} from "./MapGenerator";
import {Tile} from "./Tile";
import {TileRegistry} from "./TilesRegistry";
import {Map} from "../Map";
import {MissingTextureFixer} from "./MissingTextureFixer";

const tileSize = 20;
const tileSpacing = 20;

const MIN_POWER = 2;
const MAX_POWER = 3;
const RADIUS = 1; // Specify the smooth. 0.001 = big smooth, infinite = no smooth.

export class CloudMapGenerator extends MapGenerator
{
    private tileRegistry: TileRegistry;
    private emptyAreas: EmptyArea[];
    private randomGenerator: Phaser.RandomDataGenerator;

    constructor(group: Phaser.Group, screenWidth: number, screenHeight: number, tilesize: number, emptyAreas: EmptyArea[], randomGenerator: Phaser.RandomDataGenerator)
    {
        super(group, screenWidth, screenHeight, tilesize);

        this.tileRegistry = new TileRegistry();
        this.emptyAreas = emptyAreas;
        this.randomGenerator = randomGenerator;
    }

    generate(): Map
    {
        const map = this.group.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        map.removeAllLayers();
        map.createBlankLayer(Map.LAYER_NAME, this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize, this.group);

        this.addTileSets(map);

        let mapHeight = Math.floor(this.screenHeight / Math.pow(2, MAX_POWER));
        let mapWidth = Math.floor(this.screenWidth / Math.pow(2, MAX_POWER));
        let cloudMaps = this.generateCloudMaps(mapWidth, mapHeight);
        let points = this.mixCloudMaps(cloudMaps);
        let grounds = this.getGrounds(points);
        grounds = MissingTextureFixer.fix(grounds, this.tileRegistry);

        this.draw(map, grounds);

        // remove useless columns and rows
        const numberColumns = map.width;
        const numberRows = map.height;
        const reducedGrounds = grounds.reduce(
            function(rows: Array<Array<number>>, row: Array<number>) {
                rows.push(row.slice(0, numberColumns));
                return rows;
            },
            []
        ).slice(0, numberRows);

        return new Map(this.group, map, reducedGrounds, this.tilesize);
    }

    /**
     * Adds the tilesets used for this map generation, and the associated tiles for the tiles registry.
     *
     * @param map
     */
    private addTileSets(map: Phaser.Tilemap) {
        map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 31);
        this.tileRegistry.addTile(new Tile(35, Tile.GRASS, Tile.GRASS, Tile.GRASS, Tile.GRASS));

        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing, 132);
        this.tileRegistry.addTile(new Tile(132, Tile.MNT, Tile.MNT, Tile.GRASS, Tile.MNT));
        this.tileRegistry.addTile(new Tile(133, Tile.MNT, Tile.MNT, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(134, Tile.MNT, Tile.MNT, Tile.MNT, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(135, Tile.MNT, Tile.GRASS, Tile.GRASS, Tile.MNT));
        this.tileRegistry.addTile(new Tile(136, Tile.MNT, Tile.MNT, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(137, Tile.GRASS, Tile.MNT, Tile.MNT, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(138, Tile.MNT, Tile.GRASS, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(139, Tile.GRASS, Tile.GRASS, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(140, Tile.GRASS, Tile.MNT, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(142, Tile.MNT, Tile.GRASS, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(143, Tile.GRASS, Tile.MNT, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(145, Tile.GRASS, Tile.GRASS, Tile.GRASS, Tile.MNT));
        this.tileRegistry.addTile(new Tile(146, Tile.GRASS, Tile.GRASS, Tile.MNT, Tile.GRASS));

        map.addTilesetImage('Grss2Lav', 'Grss2Lav', tileSize, tileSize, 0, tileSpacing, 162);
        this.tileRegistry.addTile(new Tile(162, Tile.GRASS, Tile.GRASS, Tile.LAVA, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(163, Tile.GRASS, Tile.GRASS, Tile.LAVA, Tile.LAVA));
        this.tileRegistry.addTile(new Tile(164, Tile.GRASS, Tile.GRASS, Tile.GRASS, Tile.LAVA));
        this.tileRegistry.addTile(new Tile(165, Tile.GRASS, Tile.LAVA, Tile.LAVA, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(166, Tile.LAVA, Tile.LAVA, Tile.LAVA, Tile.LAVA));
        this.tileRegistry.addTile(new Tile(167, Tile.LAVA, Tile.GRASS, Tile.GRASS, Tile.LAVA));
        this.tileRegistry.addTile(new Tile(168, Tile.GRASS, Tile.LAVA, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(169, Tile.LAVA, Tile.LAVA, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(170, Tile.LAVA, Tile.GRASS, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(172, Tile.GRASS, Tile.LAVA, Tile.LAVA, Tile.LAVA));
        this.tileRegistry.addTile(new Tile(173, Tile.LAVA, Tile.GRASS, Tile.LAVA, Tile.LAVA));
        this.tileRegistry.addTile(new Tile(175, Tile.LAVA, Tile.LAVA, Tile.LAVA, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(176, Tile.LAVA, Tile.LAVA, Tile.GRASS, Tile.LAVA));

        map.addTilesetImage('Snw2Mnt', 'Snw2Mnt', tileSize, tileSize, 0, tileSpacing, 252);
        this.tileRegistry.addTile(new Tile(252, Tile.MNT, Tile.MNT, Tile.SNOW, Tile.MNT));
        this.tileRegistry.addTile(new Tile(253, Tile.MNT, Tile.MNT, Tile.SNOW, Tile.SNOW));
        this.tileRegistry.addTile(new Tile(254, Tile.MNT, Tile.MNT, Tile.MNT, Tile.SNOW));
        this.tileRegistry.addTile(new Tile(255, Tile.MNT, Tile.SNOW, Tile.SNOW, Tile.MNT));
        this.tileRegistry.addTile(new Tile(256, Tile.SNOW, Tile.SNOW, Tile.SNOW, Tile.SNOW));
        this.tileRegistry.addTile(new Tile(257, Tile.SNOW, Tile.MNT, Tile.MNT, Tile.SNOW));
        this.tileRegistry.addTile(new Tile(258, Tile.MNT, Tile.SNOW, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(259, Tile.SNOW, Tile.SNOW, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(260, Tile.SNOW, Tile.MNT, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(262, Tile.MNT, Tile.SNOW, Tile.SNOW, Tile.SNOW));
        this.tileRegistry.addTile(new Tile(263, Tile.SNOW, Tile.MNT, Tile.SNOW, Tile.SNOW));
        this.tileRegistry.addTile(new Tile(265, Tile.SNOW, Tile.SNOW, Tile.SNOW, Tile.MNT));
        this.tileRegistry.addTile(new Tile(266, Tile.SNOW, Tile.SNOW, Tile.MNT, Tile.SNOW));
    }

    private generateCloudMaps(mapWidth: number, mapHeight: number): Array<Array<Array<number>>> {
        let cloudMaps = [];

        for (let power = MIN_POWER; power < MAX_POWER; power++) {
            cloudMaps[power] = this.smoothMap(power, this.generateRandomSquares(power, mapWidth, mapHeight));
        }

        return cloudMaps;
    }

    private generateRandomSquares(power: number, mapWidth: number, mapHeight: number): Array<Array<number>> {
        let squaresMap = [];
        let blockSize = Math.pow(2, power);

        for (let y = 0; y < mapHeight; y += blockSize) {
            for (let x = 0; x < mapWidth; x += blockSize) {
                let random = Math.round(this.randomGenerator.between(0, 1));
                for (let yi = 0; yi < blockSize; yi++) {
                    for (let xi = 0; xi < blockSize; xi++) {
                        if (undefined === squaresMap[y + yi]) {
                            squaresMap[y + yi] = [];
                        }
                        let predefined = this.containsPredefined(x, y, blockSize, blockSize);
                        squaresMap[y + yi][x + xi] = null !== predefined ? predefined : random
                    }
                }
            }
        }

        return squaresMap;
    }

    private smoothMap(power: number, rudePoints: Array<Array<number>>): Array<Array<number>> {
        let diff = Math.ceil(Math.pow(2, power) / RADIUS);

        let smooth = [];
        for (let y = 0; y < rudePoints.length; y++) {
            for (let x = 0; x < rudePoints[y].length; x++) {
                let sum = 0;
                let count = 0;
                for (let yi = -diff; yi <= diff; yi++) {
                    for (let xi = -diff; xi <= diff; xi++) {
                        if (undefined !== rudePoints[y + yi] && undefined !== rudePoints[y + yi][x + xi]) {
                            sum += rudePoints[y + yi][x + xi];
                            count += 1;
                        }
                    }
                }
                if (undefined === smooth[y]) {
                    smooth[y] = [];
                }
                smooth[y][x] = sum / count;
            }
        }

        return smooth;
    }

    private mixCloudMaps(cloudMaps: Array<Array<Array<number>>>): Array<Array<number>> {
        let points = [];

        for (let y = 0; y < cloudMaps[MIN_POWER].length; y++) {
            for (let x = 0; x < cloudMaps[MIN_POWER][0].length; x ++) {
                if (undefined === points[y]) {
                    points[y] = [];
                }

                let sum = 0;
                let count = 0;
                for (let size = MIN_POWER; size < MAX_POWER; size++) {
                    sum += (size + 1) * cloudMaps[size][y][x];
                    count += (size + 1);
                }
                points[y][x] = sum / count;
            }
        }

        return points;
    }

    private getGrounds(points: Array<Array<number>>): Array<Array<number>> {
        let result = [];
        points.forEach(function (line) {
            let groudLine = [];
            line.forEach(function (cell) {
                groudLine.push(this.getGround(cell));
            }.bind(this));
            result.push(groudLine);
        }.bind(this));

        return result;
    }

    private getGround(cell: number): number|null {
        const probabilities = [
            [Tile.LAVA, 1],
            [Tile.GRASS, 2],
            [Tile.MNT, 1],
            [Tile.SNOW, 2]
        ];
        const sumProbabilities = probabilities.reduce(function (s, probability) {
            return s + probability[1];
        }, 0);

        let counter = 0;
        for (let i = 0; i < probabilities.length; i++) {
            counter += probabilities[i][1] / sumProbabilities;
            if (cell <= counter) {
                return probabilities[i][0];
            }
        }

        return null;
    }

    private draw(map: Phaser.Tilemap, points: Array<Array<number>>)
    {
        points.slice(0, -1).forEach(function (line, y) {
            line.slice(0, -1).forEach(function (cell, x) {
                let tile = this.tileRegistry.find({
                    topLeft: points[y][x],
                    topRight: points[y][x + 1],
                    bottomRight: points[y + 1][x + 1],
                    bottomLeft: points[y + 1][x]
                });

                if (null !== tile) {
                    map.putTile(tile.index, x, y);
                }

            }.bind(this))
        }.bind(this));
    }

    private containsPredefined(x: number, y: number, blockSizeX: number, blockSizeY: number)
    {
        let points = [];
        this.emptyAreas.forEach(function(center: EmptyArea) {
            for(let yi = center.getY() - center.getGap(); yi <= center.getY() + center.getGap(); yi++) {
                for(let xi = center.getX() - center.getGap(); xi <= center.getX() + center.getGap(); xi++) {
                    points.push({x: xi, y: yi});
                }
            }
        });

        let found = false;
        points.forEach(function (point) {
            if (x < point.x && point.x < (x + blockSizeX) && y < point.y && point.y < (y + blockSizeY)) {
                found = true;
            }
        });

        return found ? 1 : null;
    }
}

export class EmptyArea
{
    private x: number;
    private y: number;
    private gap: number;

    public constructor(x: number, y: number, gap: number)
    {
        this.x = x;
        this.y = y;
        this.gap = gap;
    }

    public getX(): number
    {
        return this.x;
    }

    public getY(): number
    {
        return this.y;
    }

    public getGap(): number
    {
        return this.gap;
    }
}
