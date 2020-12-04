var objID = 0;
//Num of electrons per shell level
const levels = [2,8,18,32,32,18,8];

class obj{
    constructor(x,y){
        this.id = objID;
        this.x = x;
        this.y = y;
        objID++;
    }
        //DOM object update
        update(){
            let DomObj = document.getElementById(this.id);
            //Coords
            DomObj.style.left = this.x + 'px';
            DomObj.style.top = this.y + 'px';
        }
    
}
/*--Composite objects--*/
class composite extends obj{
    constructor(x,y){
        super(x,y);
        this.unities = [];
    };
    add(unity){
        this.unities.push(unity);
    };
    remove(id){
        delete this.unities(id);
    };
};
/*--Single objects--*/
class particle extends obj{
    constructor(x,y,vel){
        super(x,y);
        this.size;
        this.charge; 
    };
};
/*---Particles---*/
class electron extends particle{
    constructor(x,y,level){
        super(x,y);
        //Unique Attributes
        this.size = 1 * 25;
        this.charge = -1;
        this.ang = 0;
        this.level = level;
        this.css_class = 'electron';
        view(this); 
    }
    rotate(){
        this.x = (230 + Math.cos(this.ang) * (this.level * 45));
        this.y = (230 + Math.sin(this.ang) * (this.level * 45));
        this.ang -= 0.01 * (this.level / 5);
        //We restart the cycle
        this.update();
    }  
}
class proton extends particle{
    constructor(x,y){
        super(x,y);
        //Unique Attributes
        this.size = 2 * 25;
        this.charge = 1;
        this.css_class = 'proton';
        view(this); 
    }  
}
class neutron extends particle{
    constructor(x,y){
        super(x,y);
        //Unique Attributes
        this.size = 2 * 25;
        this.charge = 0;
        this.css_class = 'neutron';
        view(this); 
    }  
}
/*---Parts of the atom---*/
class nucleus extends composite{
    constructor(x,y){
        super(x,y);
    }
}
class shell extends composite{
    constructor(x,y,level){
        super(x,y);
        this.css_class = 'shell';
        this.radius = (level * 45)
        this.size = this.radius * 2;
        view(this);
        this.align_to_nucleus(); 
    }
    align_to_nucleus(){
        this.x = (this.x - this.radius) + 25 - 5
        this.y = (this.y - this.radius) + 25
        this.update();
    }
    distribute_electrons(){
        let space_between = 358 / this.unities.length;
        for (let i = 0; i < this.unities.length; i++){
            this.unities[i].ang = space_between * i;
            console.log(this.unities[i].ang);
        }
    }
}
class atom extends composite{
    constructor(x,y,nucleus){
        //Default shell
        var level1 = new shell(x,y,1);
        super(x,y);
        this.nucleus = nucleus;
        this.unities = [level1];
    }
    //Num of electrons
    get_electrons(){
        var electrons = 0;
        this.unities.forEach(level => {
            electrons += level.length;
        });
        console.log(electrons);
        return electrons;
        
    }
    get_charge(){

    }
    get_valence(){
        var last_level = this.unities[this.unities.length -1];
        var valence = last_level.unities.length;
        return valence;
    }
    add_electrons(received){
        for(let i = 0; i < received; i++){
            var last_level = this.unities[this.unities.length -1];
            //If the level is full
            if(last_level.unities.length >= 
            levels[this.unities.length -1]){
                //New level
                var new_shell = new shell(this.x,this.x,this.unities.length + 1);
                this.add(new_shell);
                last_level = this.unities[this.unities.length -1];
            }
            var new_electron = new electron(0,0,this.unities.length);
            last_level.add(new_electron);
            last_level.distribute_electrons();
        }
    }
}
function distribute(diffusion,value){
    /*--Random distribution--*/
        let variability = Math.random();
        variability *= diffusion;
        if((variability *  10) % 5 == 0){
            value += variability;
        }else{
            value -= variability;
        }
        return value;
}
//create integrated atom
function instance_atom(x,y,p,n,e){
    var core = new nucleus(x,y);
    for(let i = 0; i < p; i++){
        x = distribute(5,x);
        y = distribute(5,y);
        core.add(new proton(x,y));
    }
    for(let i = 0; i < n; i++){
        x = distribute(5,x);
        y = distribute(5,y);
        core.add(new neutron(x,y)); 
    }
    var atomo = new atom(x,y,core);
    atomo.add_electrons(e);
    return atomo;
}
//Crea nodo en el DOM
function view(object){
    var DomObj = document.createElement('div');
    DomObj.setAttribute('id',object.id);
    DomObj.classList.add('Obj');
    DomObj.classList.add(object.css_class);
    //Coords
    DomObj.style.top = object.x + 'px';
    DomObj.style.left = object.y + 'px';
    //Size
    DomObj.style.width = object.size + 'px';
    DomObj.style.height = object.size + 'px';

    canvas.appendChild(DomObj);
}
var atomo = instance_atom(225,225,1,1,80);
function rotar(){
    atomo.unities.forEach(shell => {
        shell.unities.forEach(electron => {
            electron.rotate();
        });
    });
}
setInterval(rotar,1);