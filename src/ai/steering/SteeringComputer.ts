
import {Boid} from "./Boid";
import {SeekBehavior} from "./behavior/SeekBehavior";
import {WanderBehavior} from "./behavior/WanderBehavior";
import {FleeBehavior} from "./behavior/FleeBehavior";
import {PursuingBehavior} from "./behavior/PursuingBehavior";
import {EvadingBehavior} from "./behavior/EvadingBehavior";
import {PathFollowingBehavior} from "./behavior/PathFollowingBehavior";
import {PhaserPointPath} from "../path/PhaserPointPath";
import {PathPatrollingBehavior} from "./behavior/PathPatrollingBehavior";
import {CollisionReactionBehavior} from "./behavior/CollisionReactionBehavior";
import {CollisionAvoidanceBehavior} from "./behavior/CollisionAvoidanceBehavior";
import {Radar} from "../../world/vehicle/sensor/Radar";
import {Vehicle} from "../../world/vehicle/Vehicle";

/**
 * Inspired by following posts
 *
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-movement-manager--gamedev-4278
 * @see http://www.emanueleferonato.com/2016/02/01/understanding-steering-behavior-html5-example-using-phaser/
 */
export class SteeringComputer
{
    private steering : Phaser.Point;
    private host : Boid;

    private seekBehavior: SeekBehavior;
    private wanderBehavior: WanderBehavior;
    private fleeBehavior: FleeBehavior;
    private pursuingBehavior: PursuingBehavior;
    private evadingBehavior: EvadingBehavior;
    private pathFollowingBehavior: PathFollowingBehavior;
    private pathPatrollingBehavior: PathPatrollingBehavior;
    private collisionReactionBehavior: CollisionReactionBehavior;
    private collisionAvoidanceBehavior: CollisionAvoidanceBehavior;

    constructor(host: Boid)
    {
        this.host = host;
        this.steering = new Phaser.Point(0, 0);
        this.seekBehavior = new SeekBehavior(host);
        this.wanderBehavior = new WanderBehavior(host);
        this.fleeBehavior = new FleeBehavior(host);
        this.pursuingBehavior = new PursuingBehavior(host, this.seekBehavior);
        this.evadingBehavior = new EvadingBehavior(host, this.fleeBehavior);
        this.pathFollowingBehavior = new PathFollowingBehavior(host, this.seekBehavior);
        this.pathPatrollingBehavior = new PathPatrollingBehavior(host, this.seekBehavior);
        this.collisionReactionBehavior = new CollisionReactionBehavior(host);
        this.collisionAvoidanceBehavior = new CollisionAvoidanceBehavior(host);
    }

    public seek(target: Phaser.Point, slowingRadius :number = 20) :void
    {
        const force = this.seekBehavior.seek(target, slowingRadius);
        this.steering.add(force.x, force.y);
    }

    public wander() :void
    {
        const force = this.wanderBehavior.wander();
        this.steering.add(force.x, force.y);
    }

    public flee(target: Phaser.Point) :void
    {
        const force = this.fleeBehavior.flee(target);
        this.steering.add(force.x, force.y);
    }

    public pursuing(target: Boid) :void
    {
        const force = this.pursuingBehavior.pursuing(target);
        this.steering.add(force.x, force.y);
    }

    public evading(target: Boid) :void
    {
        const force = this.evadingBehavior.evading(target);
        this.steering.add(force.x, force.y);
    }

    public pathFollowing(path: PhaserPointPath, slowingRadius :number = 20) :void
    {
        const force = this.pathFollowingBehavior.followPath(path, slowingRadius);
        this.steering.add(force.x, force.y);
    }

    public pathPatrolling(path: PhaserPointPath, slowingRadius :number = 20) :void
    {
        const force = this.pathPatrollingBehavior.patrolPath(path, slowingRadius);
        this.steering.add(force.x, force.y);
    }

    public reactToCollision(body: Phaser.Physics.Arcade.Body) :void
    {
        const force = this.collisionReactionBehavior.reactToCollision(body);
        this.steering.add(force.x, force.y);
    }

    // TODO ai steering behavior should not now game objects
    public avoidCollision(radar: Radar) :void
    {
        const force = this.collisionAvoidanceBehavior.avoidCollision(radar);
        this.steering.add(force.x, force.y);
    }

    public compute() :void
    {
        // Now we add boid direction to current boid velocity
        this.host.getVelocity().add(this.steering.x, this.steering.y);
        // we normalize the velocity
        this.host.getVelocity().normalize();
        // we set the magnitude to boid speed
        this.host.getVelocity().setMagnitude(this.host.getMaxVelocity().x);

        // TODO: fix the slow down for seek behavior but break velocity for the rest
        //this.host.getVelocity().setMagnitude(this.steering.getMagnitude());

        // turn the vehicle to the velocity, don't change the angle if the velocity is null (the vehicle is attacking)
        const vehicle = (<Vehicle>this.host);
        if (vehicle.getVelocity().x != 0 && vehicle.getVelocity().y != 0) {
            vehicle.angle = 180 + Phaser.Math.radToDeg(
                    Phaser.Point.angle(
                        vehicle.getPosition(),
                        new Phaser.Point(
                            vehicle.getPosition().x + vehicle.getVelocity().x,
                            vehicle.getPosition().y + vehicle.getVelocity().y
                        )
                    )
                );
        }
    }

    public reset() :void {
        this.steering = new Phaser.Point(0, 0);
    }
}