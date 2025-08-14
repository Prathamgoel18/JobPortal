import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (!applicants?.applications?.length) {
    return <p className="text-gray-500">No applicants found.</p>;
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.applications.map((item) => {
            const fullname = item?.applicant?.fullname || "N/A";
            const email = item?.applicant?.email || "N/A";
            const phone = item?.applicant?.phoneNumber || "N/A";
            const resumeLink = item?.applicant?.profile?.resume || null;
            const resumeName = item?.applicant?.profile?.resumeOriginalName || "N/A";
            const appliedDate = item?.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "N/A";

            return (
              <TableRow key={item?._id}>
                <TableCell>{fullname}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{phone}</TableCell>
                <TableCell>
                  {resumeLink ? (
                    <a
                      className="text-blue-600 cursor-pointer"
                      href={resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resumeName}
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </TableCell>
                <TableCell>{appliedDate}</TableCell>
                <TableCell className="float-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortlistingStatus.map((status, index) => (
                        <div
                          onClick={() => statusHandler(status, item?._id)}
                          key={index}
                          className="flex w-fit items-center my-2 cursor-pointer hover:text-blue-600"
                        >
                          <span>{status}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
