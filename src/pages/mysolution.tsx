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
          } else {
            console.error('User not found');
          }
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [user]);

  useEffect(() => {
    // Get the problem ID from the query parameters
    const { id } = router.query;
    if (typeof id === 'string') {
      setSelectedProblemId(id);
    }
  }, [router.query]);

  const downloadCodeAsPdf = () => {
    if (!serviceDetails || !selectedProblemId) return;
    const solvedCodeForSpecificProblem = serviceDetails.solvedProblemsCode[selectedProblemId];
    if (!solvedCodeForSpecificProblem) return;

    const doc = new jsPDF();
    doc.text(solvedCodeForSpecificProblem, 10, 10);
    doc.save('code.pdf');
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
          {!serviceDetails || !selectedProblemId || !serviceDetails.solvedProblemsCode[selectedProblemId] ? (
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
