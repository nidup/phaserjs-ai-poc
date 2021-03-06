
import {UnitSelector} from "./UnitSelector";
import {SelectedUnitPanel} from "./SelectedUnitPanel";
import {OrderPanel} from "./OrderPanel";
import {Minimap} from "./Minimap";
import {Map} from "../ai/map/Map";
import {RecruitPanel} from "./RecruitPanel";
import {PlayerRepository} from "../game/player/PlayerRepository";
import {ItemRepository} from "../world/item/ItemRepository";
import {MenuPanel} from "./MenuPanel";
import {JukeBox} from "../world/audio/JukeBox";

export class MainPanel
{
    private unitSelector: UnitSelector;
    private selectedUnitPanel: SelectedUnitPanel;
    private recruitPanel: RecruitPanel;
    private minimap: Minimap;

    constructor(group: Phaser.Group, panelWith: number, unitSelector: UnitSelector, players: PlayerRepository, map: Map, items: ItemRepository, jukebox: JukeBox)
    {
        const screenWidth = group.game.width;
        this.unitSelector = unitSelector;

        this.minimap = new Minimap(group, panelWith, map, players, items);
        const background = group.game.add.sprite(screenWidth - panelWith, 0, 'CommandPanel', 0, group);
        background.z = 100;

        let positionY = 190;
        this.selectedUnitPanel = new SelectedUnitPanel(group, panelWith, unitSelector, positionY);

        positionY += 110;
        this.recruitPanel = new RecruitPanel(group, players.human(), positionY);

        positionY += 267;
        new OrderPanel(group, screenWidth, panelWith, players.human(), positionY);

        positionY += 125;
        new MenuPanel(group, panelWith, jukebox, positionY);
    }

    public update()
    {
        this.selectedUnitPanel.update();
        this.recruitPanel.update();
        this.minimap.update();
    }
}