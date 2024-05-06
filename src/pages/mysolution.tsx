import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Topbar from '@/components/Topbar/Topbar';
import jsPDF from 'jspdf';

type Service = {
  solvedProblemsCode: Record<string, string>;
};

const MySolution: React.FC = () => {
  const [user] = useAuthState(auth);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [selectedProblemTitle, setSelectedProblemTitle] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        if (user) {
          const docRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const { solvedProblemsCode } = data as Service;
            setServiceDetails({ solvedProblemsCode });

            // Fetch problem titles dynamically
            const problemTitles = await fetchProblemTitles(Object.keys(solvedProblemsCode));
            setSelectedProblemTitle(problemTitles[selectedProblemId] || '');
          } else {
            console.error('User not found');
          }
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [user, selectedProblemId]);

  useEffect(() => {
    // Get the problem ID from the query parameters
    const { id } = router.query;
    if (typeof id === 'string') {
      setSelectedProblemId(id);
    }
  }, [router.query]);

  const fetchProblemTitles = async (problemIds: string[]) => {
    const titles: Record<string, string> = {};
    try {
      for (const problemId of problemIds) {
        const docRef = doc(firestore, 'problems', problemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const title = data.title || '';
          // Extract text after the first period
          const textOnlyTitle = title.split('.').slice(1).join('.').trim();
          titles[problemId] = textOnlyTitle;
        }
      }
    } catch (error) {
      console.error('Error fetching problem titles:', error);
    }
    return titles;
  };
  

  const downloadCodeAsPdf = () => {
    if (!serviceDetails || !selectedProblemId || !selectedProblemTitle) return;
    
    const additionalText = "Problem : ";
    const codeText = "Code :";
    const title = selectedProblemTitle;
    const code = serviceDetails.solvedProblemsCode[selectedProblemId];
  
    if (!code) return;
  
    const doc = new jsPDF();
  
    // Set font to bold for the title
    doc.setFont('helvetica', 'bold');
    // Concatenate additional text with title
    const fullTitle = additionalText + title;
    // Draw title
    doc.text(fullTitle, doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

    // Set font to normal
    doc.setFont('helvetica', 'normal');
    
    // Draw codeText on the next line
    doc.setFont('helvetica', 'bold');

    doc.text(codeText, 10, 20);
    doc.setFont('helvetica', 'normal');

    // Draw code below codeText
    doc.text(code, 10, 30);
  
    doc.save(`${title}.pdf`);
};


  

  return (
    <>
      <Topbar />

      <div className="maincon">
        <div className="center-container">
          <div className='mysolution'>
            <div className="head">
              <h1>My Code</h1>
            </div>
            <div className="btn">
              <button className="bg-brand-orange hover:bg-brand-orange-s text-white py-2 px-3 rounded" onClick={downloadCodeAsPdf}>
                Download code
              </button>
            </div>
          </div>
          <hr />
          <div className="text-xl text-center font-bold mb-5">
          Problem : {selectedProblemTitle ? selectedProblemTitle : '!!! Submit Your Code to see the title!!!'}
          </div>
          {!serviceDetails || !selectedProblemId || !serviceDetails.solvedProblemsCode || !serviceDetails.solvedProblemsCode[selectedProblemId] ? (
            <p>Submit your code first</p>
          ) : (
            <pre>{serviceDetails.solvedProblemsCode[selectedProblemId]}</pre>
          )}
        </div>
      </div>
    </>
  );
};

export default MySolution;
