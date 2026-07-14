interface Props{

title:string;

value:string;

}

export default function StatCard({

title,

value

}:Props){

return(

<div className="bg-[#151922] rounded-3xl p-8">

<h3 className="text-gray-400">

{title}

</h3>

<h2 className="text-5xl font-black mt-6">

{value}

</h2>

</div>

);

}