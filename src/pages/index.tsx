import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import Topbar from "@/components/Topbar/Topbar";
import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
	const [inputs,setInputs] = useState({
		id: '',
		title: '',
		difficulty: '',
		category: '',
		vedioId: '',
		link: '',
		order: 0,
		likes: 0,
		disliked: 0,
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs({
			...inputs,	
			[e.target.name]: e.target.value
			});
			
			};

			const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				//convert inputs.order to integer
				const newProblem = {
					...inputs,
					order: Number(inputs.order),
				}
				await setDoc(doc(firestore, "problems", inputs.id), newProblem);
				alert("saved to db")
			}
			
	
  return (
    <>
     
      <main className="bg-dark-layer-2 min-h-screen">
        <Topbar/>
        <h1
					className='text-2xl text-center text-white dark:text-white font-medium
					uppercase mt-10 mb-5'
				>
					&ldquo; QUALITY OVER QUANTITY &rdquo; 👇
				</h1>
				<div className='relative overflow-x-auto mx-auto px-6 pb-10'>
					
					<table className='text-sm text-left text-white dark:text-white sm:w-7/12 w-full max-w-[1200px] mx-auto'>
							<thead className='text-xs text-white uppercase dark:white-400 border-b '>
								<tr>
									<th scope='col' className='px-1 py-3 w-0 font-medium'>
										Status
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Title
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Difficulty
									</th>

									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Category
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Solution
									</th>
								</tr>
							</thead>
          <ProblemsTable/>
					</table>
				</div>

				{/* temp form */}
				<form className='p-6 flex flex-col max-w-sm gap-3' onSubmit={handleSubmit}>
			<input onChange={handleInputChange} type="text" placeholder="problem id" name="id" value={inputs.id} />
			<input onChange={handleInputChange} type="text" placeholder="title" name="title" value={inputs.title} />
			<input onChange={handleInputChange} type="text" placeholder="difficulty" name="difficulty" value={inputs.difficulty} />
			<input onChange={handleInputChange} type="text" placeholder="category" name="category" value={inputs.category} />
			<input onChange={handleInputChange} type="text" placeholder="order" name="order" value={inputs.order} />
			<input onChange={handleInputChange} type="text" placeholder="vedioId?" name="vedioId" value={inputs.vedioId} />
			<input onChange={handleInputChange} type="text" placeholder="link?" name="link" value={inputs.link} />
			<button className="bg-white" type="submit">Save to db</button>
			</form>
			</main>
		</>
	);
   
}
