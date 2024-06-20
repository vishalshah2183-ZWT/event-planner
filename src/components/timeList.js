export var time = []

for(let i = 0 ; i< 24 ;i++)
    {
        for( let j=0 ; j < 4 ; j++)
            {
                time?.push(`${((i < 10) ? '0'+i : i)}:${((j*15 < 10) ? '0'+ j*15 : j*15)}`)
            }
    }
time?.push('24:00')

time = time?.map((item,index)=>({label:item,value:index,disable:false}))