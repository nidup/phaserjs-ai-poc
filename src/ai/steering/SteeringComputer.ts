
import {Boid} from "./Boid";
import {Builder} from "../../vehicle/Builder";

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

    constructor (host: Boid)
    {
        // TODO: temporary
        this.host = host;
        this.steering = new Phaser.Point(0, 0);
    }

    public seek(target: Phaser.Point, slowingRadius :number = 20) :void
    {
        const force = this.doSeek(target, slowingRadius);
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

        (<Builder>this.host).angle = 180 + Phaser.Math.radToDeg(
                Phaser.Point.angle(
                    this.host.getPosition(),
                    new Phaser.Point(
                        this.host.getPosition().x + this.host.getVelocity().x,
                        this.host.getPosition().y + this.host.getVelocity().y
                    )
                )
            );

//        console.log(this.host.getMaxVelocity());
    }

    public reset() :void {
        this.steering = new Phaser.Point(0, 0);
    }

    /*
    public function flee(target :Vector3D) :void {}
    public function wander() :void {}
    public function evade(target :IBoid) :void {}
    public function pursuit(target :IBoid) :void {}


    // The internal API
    private function doFlee(target :Vector3D) :Vector3D {}
    private function doWander() :Vector3D {}
    private function doEvade(target :IBoid) :Vector3D {}
    private function doPursuit(target :IBoid) :Vector3D {}
    */

    private doSeek(target :Phaser.Point, slowingRadius :number = 0)
    {
        // direction vector is the straight direction from the boid to the target
        const direction = new Phaser.Point(target.x, target.y);
        // now we subtract the current boid position
        direction.subtract(this.host.getPosition().x, this.host.getPosition().y);
        // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
        direction.normalize();
        // time to set magnitude (length) to boid speed
        direction.setMagnitude(this.host.getMaxVelocity().x);
        // now we subtract the current boid velocity
        direction.subtract(this.host.getVelocity().x, this.host.getVelocity().y);
        // normalizing again
        direction.normalize();
        // finally we set the magnitude to boid force, which should be WAY lower than its velocity
//        direction.setMagnitude(this.force);

        // TODO implem slowing!

//         const distance = direction.length;
        /*
         if (distance <= slowingRadius) {
         desired.scaleBy(host.getMaxVelocity() * distance/slowingRadius);
         } else {
         desired.scaleBy(host.getMaxVelocity());
         }
         */

        return direction;
    }
}