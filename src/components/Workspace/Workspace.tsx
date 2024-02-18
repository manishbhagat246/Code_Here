import React from "react";
import Split from 'react-split'
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import { problems } from "@/utils/problems";

type WorkspaceProps = {
	problem: Problem
};

const Workspace: React.FC<WorkspaceProps> = ({problem}) => {


	return (
		<Split className='split' minSize={0}>
		{/* <Split className='split'> */}
			<ProblemDescription problem={problem}/>
		<Playground problem={problem}/>			
		</Split>
	);
};
export default Workspace;
