
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {MapAnalyse} from "../../ai/map/MapAnalyse";
import {PathFinder} from "../../ai/path/PathFinder";
import {PhaserPointPath} from "../../ai/path/PhaserPointPath";
import {State} from "../../ai/fsm/State";
import {BrainText} from "./info/BrainText";
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";

export class Builder extends Vehicle
{
    public body: Phaser.Physics.Arcade.Body;
    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, key: string, frame: number, mapAnalyse: MapAnalyse)
    {
        super(game, x, y, army, radar, key, frame);

        this.maxHealth = 80;
        this.health = this.maxHealth;
        this.maxVelocity = 60;
        this.cost = 80;

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.behavior = new SteeringComputer(this);

        this.pathfinder = new PathFinder(mapAnalyse);
        this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), new Phaser.Point(800, 200));

        this.brain.pushState(new State('path following', this.pathFollowing));
    }

    // TODO: for debug purpose
    public changePath(finalDestination: Phaser.Point)
    {
        const newPath = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), finalDestination);
        if (newPath) {
            this.path = newPath;
        }
    }

    public pathFollowing = () =>
    {
        if (this.path && this.path.lastNode() && this.getPosition().distance(this.path.lastNode()) > 20) {
            this.behavior.pathFollowing(this.path);
            this.behavior.reactToCollision(this.body);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public wander = () =>
    {
        if (this.path == null) {
            this.behavior.wander();
            this.behavior.avoidCollision(this.radar);
            this.behavior.reactToCollision(this.body);
        } else {
            this.brain.popState();
            this.brain.pushState(new State('path following', this.pathFollowing));
        }
    }
}
