export class StatStore {
    private static tallies: Map<string, number>;

    constructor(map: Map<string, number>){
        StatStore.tallies = map;
    }

    getTallies(): Map<string, number>{
        return StatStore.tallies;
    }

    setTallies(map: Map<string, number>){
        
        console.log(map);

        map.forEach((v, k) => {
            if(StatStore.tallies.has(k)){
                StatStore.tallies.set(k, ++v);
                console.log("old key");
                console.log(k, v);
            }else{
                StatStore.tallies.set(k, v);
                console.log(k, v);
            }
        });
        
        //console.log(this._tallies);
    }

    
}
