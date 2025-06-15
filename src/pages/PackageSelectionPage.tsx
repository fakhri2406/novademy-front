import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPackages } from '../features/packages/packagesSlice';
import { RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';
import { getUserIdFromToken } from '../utils/auth';
import './PackageSelectionPage.css';

interface Subscription {
    id: string;
    userId: string;
    packageId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

const PackageSelectionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { packages, status, error } = useSelector((state: RootState) => state.packages);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPackages());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get<Subscription[]>(`/subscription/active/${userId}`);
        setUserSubscriptions(response.data);
      } catch (error) {
        console.error('Failed to fetch user subscriptions:', error);
      } finally {
        setIsLoadingSubscriptions(false);
      }
    };

    fetchUserSubscriptions();
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await api.get('/course');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSelectPackage = (packageId: string, packageTitle: string, price: number) => {
    setLoading((prev) => ({ ...prev, [packageId]: true }));
    try {
      navigate('/payment', {
        state: {
          packageId,
          packageName: packageTitle,
          amount: price
        }
      });
    } catch (err) {
      console.error('Failed to process package selection:', err);
    } finally {
      setLoading((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  if (status === 'loading' || isLoadingSubscriptions || isLoadingCourses) {
    return (
      <div className="package-bg">
        <div className="package-center">
          <div className="package-spinner" />
          <p className="package-loading-text">{t('loadingPackages')}</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="package-bg">
        <div className="package-center">
          <div className="package-error">
            {t('error')}: {error}
          </div>
        </div>
      </div>
    );
  }

  const availablePackages = packages.filter(
    pkg => !userSubscriptions.some(sub => sub.packageId === pkg.id)
  );

  if (availablePackages.length === 0) {
    return (
      <div className="package-bg">
        <div className="package-center">
          <div className="package-info">
            <h3>{t('noAvailablePackages')}</h3>
            <p>{t('allPackagesPurchased')}</p>
            <button 
              className="package-btn" 
              onClick={() => navigate('/dashboard')}
            >
              {t('goToDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For demo: show only first two packages in the new design
  const [first, second] = availablePackages;

  return (
    <div className="package-bg">
      <div className="package-center">
        <h1 className="package-title">{t('selectPackage')}</h1>
        <div className="package-cards-row">
          {first && (
            <div className="package-card">
              <div className="package-price">{first.price} AZN</div>
              <div className="package-name">{first.title}</div>
              <div className="package-description">{first.description}</div>
              {first.courseIds && first.courseIds.length > 0 && (
                <ul className="package-courses-list">
                  {first.courseIds.map((cid: string) => {
                    const course = courses.find(c => c.id === cid);
                    return course ? <li key={cid}>{course.title}</li> : null;
                  })}
                </ul>
              )}
              <button
                className="package-btn"
                disabled={loading[first.id]}
                onClick={() => handleSelectPackage(first.id, first.title, first.price)}
              >
                {loading[first.id] ? t('processing') : t('continue')}
              </button>
            </div>
          )}
          {second && (
            <div className="package-card popular">
              <div className="package-popular-badge">{t('mostPopular')}</div>
              <div className="package-price">{second.price} AZN</div>
              <div className="package-name">{second.title}</div>
              <div className="package-description">{second.description}</div>
              {second.courseIds && second.courseIds.length > 0 && (
                <ul className="package-courses-list">
                  {second.courseIds.map((cid: string) => {
                    const course = courses.find(c => c.id === cid);
                    return course ? <li key={cid}>{course.title}</li> : null;
                  })}
                </ul>
              )}
              <button
                className="package-btn"
                disabled={loading[second.id]}
                onClick={() => handleSelectPackage(second.id, second.title, second.price)}
              >
                {loading[second.id] ? t('processing') : t('continue')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionPage; 