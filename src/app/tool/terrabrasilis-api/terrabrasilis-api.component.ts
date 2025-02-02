import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

/**
 *  import terrabrasilis api from node_modules
 */
import * as Terrabrasilis from "terrabrasilis-api";
import { DialogComponent } from '../../dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Layer } from '../../entity/layer';

@Component({
  selector: 'app-terrabrasilis-api',
  template: ``
})
export class TerrabrasilisApiComponent implements OnInit {
    /**
     * Terrabrasilis API module
     */
    private Terrabrasilis: any = Terrabrasilis;

    constructor(
        private dialog : MatDialog
        , private dom: DomSanitizer
        , private cdRef: ChangeDetectorRef
    ) { }

    ////////////////////////////////////////////////
    //// Angular life cycle hooks
    ////////////////////////////////////////////////
    ngOnInit() {}

    ////////////////////////////////////////////////
    //// MapBuilder
    ////////////////////////////////////////////////
    public map(points: any, baselayers: any, overlayers:any ): void  {
        Terrabrasilis.map(points.longitude, points.latitude) 
            .addCustomizedBaseLayers(JSON.parse(JSON.stringify(baselayers)))
            .addCustomizedOverLayers(JSON.parse(JSON.stringify(overlayers)))
            //.addBaseLayers(JSON.parse(JSON.stringify(this.baselayers)))
            //.addOverLayers(JSON.parse(JSON.stringify(this.overlayers)))
            //.enableLegendAndToolToLayers()
            .enableDrawFeatureTool()
            .enableLayersControlTool()
            .enableScaleControlTool()
            .enableDisplayMouseCoordinates()
            // .enableInvalidateSize()
            .hideStandardLayerControl()
            .enableGeocodingTool();
    }

    ////////////////////////////////////////////////
    //// Layers interactions
    ////////////////////////////////////////////////
    layerOpacity(layerObject:any, event:any) {      
        this.Terrabrasilis.setOpacityToLayer(layerObject, (event.value));
    }

    ////////////////////////////////////////////////
    //// Sidebar header tools
    ////////////////////////////////////////////////
    fullScreen() {
        Terrabrasilis.fullScreen();
    }

    drawSimpleShape() {
        this.showDialog("Terrabrasilis web application.");
    }

    resetMap() {
        Terrabrasilis.resetMap();
    }

    undo() {
        Terrabrasilis.undo();
    }

    redo() {
        Terrabrasilis.redo();
    }

    getFeatureInfo(event:any) {        
        Terrabrasilis.addGetLayerFeatureInfoEventToMap(event);
    }

    showCoordinates(event:any) {
        Terrabrasilis.addShowCoordinatesEventToMap(event);
    }

    ////////////////////////////////////////////////
    //// Components
    ////////////////////////////////////////////////
    download(layer: Layer) {       
        let download = "";
        layer.downloads.forEach((d:any) => {
            download += "<div><h5 class=\"card-title\">Obter shapefile para " + layer.title + ".</h5>" +
            "            <p class=\"card-text\">" + d.name + ": " + d.description + "</p>" +
            "            <a href=\"" + d.link + "\" class=\"btn btn-primary btn-success\">Download</a><div>";
        });
        
        let html =         
        "<div class=\"container\">" +
        "    <div class=\"card\">" +
        "        <div class=\"card-body\">" + download +   
        "        </div>" +
        "    </div>" +
        "</div>";
        this.showDialog(html);
    }

    getLegend(layer: any, urlOrCompleteSrcImgElement: boolean): string {        
        let host = layer.datasource == null ? layer.thirdHost : layer.datasource.host;
        let indexof = host.indexOf("?");
        
        let url = indexof < 0 ? host + "?request=GetLegendGraphic&format=image/png&width=20&height=20&layer=" + layer.workspace + ":" + layer.name + "&service=WMS" 
                            : host + "request=GetLegendGraphic&format=image/png&width=20&height=20&layer=" + layer.workspace + ":" + layer.name  + "&service=WMS"; 
        
        return   urlOrCompleteSrcImgElement == true ? "<img src='" + url + "' />" : url;
    }

    getBasicLayerInfo(layerObject:any) {
        this.cdRef.detectChanges();

        console.log(layerObject);
        
        let match = /gwc\/service\/wms/;

        let source = layerObject.datasource != null ?
            (match.test(layerObject.datasource.host) == true ? 
                layerObject.datasource.host.replace("gwc/service/wms", "ows") : layerObject.datasource.host) :
            layerObject.thirdHost

        let layerBasicInfo = {
            title: layerObject.title,
            layer: layerObject.name,
            workspace: layerObject.workspace,
            source: source
        }

        let infoTable = "<table class=\"table-responsive table \"><tr class=\"table-active\"><th colspan=\"3\">" + layerBasicInfo.title + "</th></tr>" 
                        + " <tr> <td><b>Layer</b></td><td colspan=\"2\">" + layerBasicInfo.layer + "</td></tr>"
                        + "<tr><td><b>Workspace</b></td><td colspan=\"2\">" + layerBasicInfo.workspace + "</td></tr>"
                        + "<tr><td><b>Source</b></td><td colspan=\"2\">" + layerBasicInfo.source + "</td></tr></table>";

        this.showDialog(infoTable);
    }

    ////////////////////////////////////////////////
    //// General tools
    ////////////////////////////////////////////////
    enableLoading(dom?:string): void {
        Terrabrasilis.enableLoading(dom);
    }

    disableLoading(dom?:string): void {
        Terrabrasilis.disableLoading(dom);
    }

    reorderOverLayers(layers: any): void {
        Terrabrasilis.reorderOverLayers(layers);
    }

    getTerrabrasilisBaselayers(): any {
        return Terrabrasilis.getTerrabrasilisBaselayers();
    }

    deactiveLayer(layer:any):void {
        Terrabrasilis.deactiveLayer(layer);
    }
    
    activeLayer(layer: any): void {
        Terrabrasilis.activeLayer(layer);
    }

    isLayerActived(layer:any): boolean {
        return Terrabrasilis.isLayerActived(layer);
    }

    getLayerByName(layerName:string): any {
        return Terrabrasilis.getLayerByName(layerName);        
    }
    
    addGetLayerFeatureInfoEventToMap(event: any): void {
        Terrabrasilis.addGetLayerFeatureInfoEventToMap(event);
    }

    addShowCoordinatesEventToMap(event: any): void {
        Terrabrasilis.addShowCoordinatesEventToMap(event);
    }

    moveLayerToBack(layer:any): void {
        Terrabrasilis.moveLayerToBack(layer);
    }
    
    moveLayerToFront(layer:any) {
        Terrabrasilis.moveLayerToFront(layer);
    }
    
    ////////////////////////////////////////////////
    //// General use dialog
    ////////////////////////////////////////////////
    showDialog(content: string) : void {
        let dialogRef = this.dialog.open(DialogComponent, { width : '450px' });
        dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(content);
    }

    /**
     * Enable or disable TimeDimension tool for one layer.
     * @param layer A layer with time dimension available.
     */
    onOffTimeDimension(layer: Layer) {
        // verify if layer is raster or vector type and use it to set aggregate times value.
        Terrabrasilis.onOffTimeDimension(layer.name, layer.isAggregatable /*aggregateTimes*/);
    }

    ////////////////////////////////////////////////
    //// Private methods
    ////////////////////////////////////////////////    
}
