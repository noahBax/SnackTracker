class CircleSelector extends HTMLElement {
    wrapper: HTMLDivElement;
    svg: SVGSVGElement;
    circle: SVGCircleElement;
    div: HTMLDivElement;
    p: HTMLParagraphElement;

    height: number;
    data: data;
    container: HTMLDivElement;
    
    constructor(data: data, containerElem: HTMLDivElement, height?: number) {
        super()

        console.log("I live", data)

        this.data = data;

        this.container = containerElem;

        this.height = height ?? 100;
        // Defaults to 100

        const shadow = this.attachShadow( { mode: 'open' } );

        this.wrapper = document.createElement('div');

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', `0 0 100 100`);

            this.svg.style.display = 'block';

        this.circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            this.circle.setAttribute('cx', '50');
            this.circle.setAttribute('cy', '50');
            this.circle.setAttribute('r', '50');
            this.circle.setAttribute('fill', "rgb(171, 52, 40)");

        this.svg.appendChild(this.circle);
        this.wrapper.appendChild(this.svg);

        this.div = document.createElement('div');
            

        this.p = document.createElement('p');
            this.p.innerHTML = 'Chicken Parmesan ' + data.indexInDatabase;
            this.p.setAttribute('style', `
                text-align: center;
                margin: unset;
            `)

        this.div.appendChild(this.p);
        this.wrapper.appendChild(this.div);

        shadow.appendChild(this.wrapper);
    }

    connectedCallback() {
        if (!this.isConnected) {
            return
        }
        this.height = this.height ?? parseInt(this.dataset.width ?? "100");
        // Defaults to 100px

        this.wrapper.setAttribute('style', `
            width: ${this.height}px;
            height: ${this.height}px
        `);

        this.svg.style.width = this.height + "px";
        this.svg.style.height = this.height + "px";

        this.div.setAttribute('style', `
            color: white;
            font-family: 'Roboto';
            top: 0px;
            left: 0px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translate(0px, -100%);
            height: ${this.height}px;
            width: ${this.height}px;
        `);

        this.addEventListener('click', function (e: MouseEvent) {
            let me = (e.target as CircleSelector);
            console.log(me, me.data.indexInDatabase);
            if (me.data.children.length == 0) {
                console.log("We have reached the bottom");
                me.container.innerHTML = "Goodbye";
                return
            } else {
                console.log("Further down the rabbit hole...")
                for (let i = 0; i < me.data.children.length; i++) {
                    me.parentElement?.appendChild(new CircleSelector(me.data.children[i], me.container, me.height));
                }
            }
        });

    }
}

customElements.define("circle-selector", CircleSelector);

interface data {
    indexInDatabase: number
    children: data[]
}

const testData: data = {
    indexInDatabase: 0,
    children: [
        {
            indexInDatabase: 1,
            children: []
        },
        {
            indexInDatabase: 2,
            children: []
        },
        {
            indexInDatabase: 3,
            children: []
        },
        {
            indexInDatabase: 4,
            children: []
        },
        {
            indexInDatabase: 5,
            children: []
        }
    ]
}

function loaded() {
    
    document.getElementById('menu')?.appendChild(new CircleSelector(testData, document.getElementById('menu') as HTMLDivElement, 110));
}
